import * as React from "react";
import { AccessibilityTreeItemComponent } from "./accessibilityTreeItemComponent";
import type { AccessibilityItem } from "./accessibilityItem";
import { AccessibilityGUIItem } from "./accessibilityGUIItem";
import { AccessibilityNodeItem } from "./accessibilityNodeItem";
import type { Scene } from "core/scene";
import type { Observable, Observer } from "core/Misc/observable";
import type { Nullable } from "core/types";
import { AbstractMesh } from "core/Meshes/abstractMesh";
import { AdvancedDynamicTexture } from "gui/2D/advancedDynamicTexture";
import { Button } from "gui/2D/controls/button";
import { Container } from "gui/2D/controls/container";
import type { Control } from "gui/2D/controls/control";
import type { Node } from "core/node";

interface IAccessibilityTreeComponentProps {
    scene: Scene;
}
interface IAccessibilityTreeComponentState {
    a11yTreeItems: AccessibilityItem[];
}

export class AccessibilityTreeComponent extends React.Component<IAccessibilityTreeComponentProps, IAccessibilityTreeComponentState> {
    private _observersMap = new Map<Observable<any>, Nullable<Observer<any>>>();

    constructor(props: IAccessibilityTreeComponentProps) {
        super(props);
        const a11yTreeItems = this._updateAccessibilityTreeItems();
        this.state = {
            a11yTreeItems: a11yTreeItems,
        };
    }

    componentDidMount() {
        console.log("componentDidMount");
        const scene = this.props.scene;

        // Find all a11y entities in the scene, assemble the a11y forest (a11yTreeItems), and update React state to let React update DOM.
        const updateA11yTree: () => void = () => {
            const a11yTreeItems = this._updateAccessibilityTreeItems();
            this.setState({
                a11yTreeItems: a11yTreeItems,
            });
        };

        const addGUIObservers = (control: Control) => {
            // observe isVisible changed
            if (!this._observersMap.has(control.onIsVisibleChangedObservable)) {
                this._observersMap.set(control.onIsVisibleChangedObservable, control.onIsVisibleChangedObservable.add(updateA11yTree));
            }

            if (!this._observersMap.has(control.onAccessibilityTagChangedObservable)) {
                this._observersMap.set(control.onAccessibilityTagChangedObservable, control.onAccessibilityTagChangedObservable.add(updateA11yTree));
            }

            if (control instanceof Container) {
                const container = control as Container;

                // observe add control and deal with new controls
                if (!this._observersMap.has(container.onControlAddedObservable)) {
                    this._observersMap.set(
                        container.onControlAddedObservable,
                        container.onControlAddedObservable.add((newControl) => {
                            if (newControl) {
                                // deal with the new added control
                                addGUIObservers(newControl);
                            }
                            updateA11yTree();
                        })
                    );
                }

                // observe remove control
                if (!this._observersMap.has(container.onControlRemovedObservable)) {
                    this._observersMap.set(
                        container.onControlRemovedObservable,
                        container.onControlRemovedObservable.add((removedControl) => {
                            updateA11yTree();
                        })
                    );
                }

                // deal with children
                control._children.forEach((child) => {
                    addGUIObservers(child);
                });
            }
        };

        const addNodeObservers = (node: Node) => {
            if (!this._observersMap.has(node.onEnabledStateChangedObservable)) {
                this._observersMap.set(node.onEnabledStateChangedObservable, node.onEnabledStateChangedObservable.add(updateA11yTree));
            }

            if (!this._observersMap.has(node.onAccessibilityTagChangedObservable)) {
                this._observersMap.set(node.onAccessibilityTagChangedObservable, node.onAccessibilityTagChangedObservable.add(updateA11yTree));
            }

            // If the node has GUI, add observer to the controls
            if (this._isGUI(node)) {
                const curMesh = node as AbstractMesh;
                const adt = curMesh.material?.getActiveTextures()[0] as AdvancedDynamicTexture;
                const guiRoot = adt.getChildren();
                guiRoot.forEach((control) => addGUIObservers(control));
            }
        };

        // observe add node and deal with new nodes
        if (!this._observersMap.has(scene.onNewMeshAddedObservable)) {
            this._observersMap.set(
                scene.onNewMeshAddedObservable,
                scene.onNewMeshAddedObservable.add((newNode) => {
                    updateA11yTree();
                    addNodeObservers(newNode);
                })
            );
        }
        if (!this._observersMap.has(scene.onNewTransformNodeAddedObservable)) {
            this._observersMap.set(
                scene.onNewTransformNodeAddedObservable,
                scene.onNewTransformNodeAddedObservable.add((newNode) => {
                    updateA11yTree();
                    addNodeObservers(newNode);
                })
            );
        }
        // observe remove node
        if (!this._observersMap.has(scene.onMeshRemovedObservable)) {
            this._observersMap.set(scene.onMeshRemovedObservable, scene.onMeshRemovedObservable.add(updateA11yTree));
        }
        if (!this._observersMap.has(scene.onTransformNodeRemovedObservable)) {
            this._observersMap.set(scene.onTransformNodeRemovedObservable, scene.onTransformNodeRemovedObservable.add(updateA11yTree));
        }

        // observe node enabled changed
        scene.getNodes().forEach((node) => {
            addNodeObservers(node);
        });
    }

    componentWillUnmount() {
        console.log("componentWillUnmount");
        this._observersMap.forEach((observer, observable) => {
            observable.remove(observer);
        });
        this._observersMap.clear();
    }

    render() {
        return (
            <div className="accessibility-tree">
                {this.state.a11yTreeItems.map((item) => {
                    return (
                        <AccessibilityTreeItemComponent
                            a11yItem={item}
                            level={1}
                            key={item.entity.uniqueId !== undefined && item.entity.uniqueId !== null ? item.entity.uniqueId : item.entity.name}
                        />
                    );
                })}
            </div>
        );
    }

    private _updateAccessibilityTreeItems(): AccessibilityItem[] {
        // Nodes
        const rootNodes = this.props.scene.rootNodes.slice(0);
        for (const mesh of this.props.scene.meshes) {
            // Adding nodes that are parented to a bone
            if (mesh.parent && mesh.parent.getClassName() === "Bone") {
                rootNodes.push(mesh);
            }
        }

        // Get accessibility tree's root nodes
        const a11yTreeItems = this._getAccessibilityTreeItemsFromNodes(rootNodes);
        return a11yTreeItems;
    }

    private _getAccessibilityTreeItemsFromNodes(rootItems: Node[]): AccessibilityItem[] {
        if (!rootItems || rootItems.length === 0) {
            return [];
        }

        const result: AccessibilityItem[] = [];
        const queue: Node[] = [...rootItems];
        for (let i: number = 0; i < queue.length; i++) {
            const curNode = queue[i];
            if (!curNode.isEnabled()) {
                continue;
            }

            if (this._isGUI(curNode)) {
                // if node texture is GUI, add that as a a11y GUI item (renders differently)
                const curMesh = curNode as AbstractMesh;
                const adt = curMesh.material?.getActiveTextures()[0] as AdvancedDynamicTexture;
                const guiRoot = adt.getChildren();
                result.push(new AccessibilityNodeItem(curNode, this._getAccessibilityTreeItemsFromGUI(guiRoot)));
            } else if (curNode.accessibilityTag) {
                result.push(new AccessibilityNodeItem(curNode, this._getAccessibilityTreeItemsFromNodes(curNode.getChildren())));
            } else {
                queue.push(...curNode.getChildren());
            }
        }

        return result;
    }

    private _getAccessibilityTreeItemsFromGUI(rootItems: Control[]): AccessibilityGUIItem[] {
        if (!rootItems || rootItems.length === 0) {
            return [];
        }
        const result: AccessibilityGUIItem[] = [];
        const queue: Control[] = [...rootItems];
        for (let i: number = 0; i < queue.length; i++) {
            const curNode = queue[i];
            if (!curNode.isVisible) {
                continue;
            }
            if (curNode instanceof Container && curNode.children.length !== 0 && !(curNode instanceof Button)) {
                const curContainer = curNode as Container;
                result.push(new AccessibilityGUIItem(curContainer, this._getAccessibilityTreeItemsFromGUI(curContainer.children)));
            } else {
                result.push(new AccessibilityGUIItem(curNode, []));
            }
        }

        return result;
    }

    private _isGUI(node: Node) {
        let isGUI = false;
        if (node instanceof AbstractMesh) {
            const curMesh = node as AbstractMesh;
            const textures = curMesh.material?.getActiveTextures();
            if (textures && textures[0] instanceof AdvancedDynamicTexture) {
                isGUI = true;
            }
        }
        return isGUI;
    }
}
