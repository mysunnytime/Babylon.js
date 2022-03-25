import * as React from "react";
import { Scene } from "babylonjs/scene";

interface IAccessibilityTreeComponentProps {
    scene: Scene;
}

export class AccessibilityTreeComponent extends React.Component<IAccessibilityTreeComponentProps> {
    constructor(props: IAccessibilityTreeComponentProps) {
        super(props);
    }

    render() {

        return (null
            // <div className="accessibility-tree">
                // {a11yTreeRootNodes.map((item) => {
                //     return (
                //         <AccessibilityTreeNodeComponent
                //             a11yNode={item}
                //             key={item.node.uniqueId !== undefined && item.node.uniqueId !== null ? item.node.uniqueId : item.node.name}
                //         />
                //     );
                // })}
            // </div>
        );
    }
}