import React from "react";
import { CSSProperties } from "react";
import './CollapseContainer.css';

declare const manywho: any;

/*
This class shows a chat history.

*/
export default class Collapse extends React.Component<any,any> {
    
    expanderParentId: string;
    expandedWidth: string;

    constructor(props: any){
        super(props);
        this.moveHappened = this.moveHappened.bind(this);
        this.buildCollapsedContent = this.buildCollapsedContent.bind(this);
        this.buildExpandedContent = this.buildExpandedContent.bind(this);
        this.closeExpander = this.closeExpander.bind(this);
        this.buttonClicked = this.buttonClicked.bind(this);
        this.state = {selectedExpander: undefined};        
    }

    componentDidMount(){
        
    }

    componentWillUnmount(){
        
    }

    moveHappened(xhr: XMLHttpRequest, request: any) {
        if ((xhr as any).invokeType === 'FORWARD') {
            
        }
    }

    closeExpander() {
        this.setState({selectedExpander: undefined});
    }

    buttonClicked(containerId: string){
        this.setState({selectedExpander: containerId});
    }

    render() {
        const style: CSSProperties = {};
        style.width = '100%';
        style.height = '100%';

        let cont: any = manywho.model.getContainer(this.props.id, this.props.flowKey);
        let childContainers: any[] = manywho.model.getChildren(this.props.id, this.props.flowKey);
        let expanderContent: any;
        let content: any[] = [];
        

        childContainers.forEach((kid: any) => {
            if(kid.containerType==="GROUP") {
                this.expandedWidth = kid.attributes?.expandedWidth || "20%";
                this.expanderParentId = kid.id;
                if(this.state.selectedExpander) {
                    expanderContent = this.buildExpandedContent(kid);
                }
                else {
                    expanderContent = this.buildCollapsedContent(kid);
                }
            }
            else {
               content.push(this.buildStandardContent(kid, this.props.flowKey)); 
            }
        });
        
        return (
            <div
                className='colcon'
                style={style}
                id={this.props.id}
            >
                <div
                    className='colcon-content'
                >
                    {content}
                </div>
                {expanderContent}
            </div>
        );
    }

    buildStandardContent(item: any, flowKey: string) {
        let content: any;
        const Outcome : any = manywho.component.getByName("outcome");
        let label = null;
        if (item.label) {
            label = <h3>{item.label}</h3>;
        }
        const outcomes = manywho.model.getOutcomes(item.id, this.props.flowKey);
        const outcomeButtons = outcomes && outcomes.map((outcome: any) => {
            return <Outcome id={outcome.id} flowKey={this.props.flowKey} />;
        });
        if(manywho.model.isContainer(item)) {
            
            const Component = manywho.component.getByName("mw-" + item.containerType);
            let className = manywho.styling.getClasses(
                this.props.parentId, 
                item.id, 
                item.containerType, 
                this.props.flowKey,
            ).join(' ');
            className += ' mw-container';

            if (typeof Component !== 'undefined') {
                Component.displayName = "mw-" + item.containerType;
            }

            let cpt: any = Component ? React.createElement(Component, {id: item.id, flowKey: this.props.flowKey}) : <noscript />;
                        
            content=(
                <div className={className} id={this.props.id}>
                    {label}
                    {cpt}
                    {outcomeButtons}
                </div>
            );
        }
        else {
            
            
            const Component = manywho.component.getByName(item.componentType, this.props.flowKey);
            let className = manywho.styling.getClasses(
                this.props.parentId, 
                item.id, 
                item.componentType, 
                this.props.flowKey,
            ).join(' ');
            if (item.isValid === false || item.isValid === false) {
                className += ' has-error';
            }
            if (item.isVisible === false) {
                className += ' hidden';
            }
            className += ' form-group';
            
            let cpt: any = Component ? React.createElement(Component, {id: item.id, flowKey: this.props.flowKey}) : <noscript />;
                        
            content=(
                <div 
                    className={className} 
                    id={item.id}
                >
                    {cpt}
                </div>
            );

            //{outcomeButtons}
        }
        return content;
    }

    // this will draw a bar of buttons, one for each tab page
    buildCollapsedContent(container: any) {
        let buttons: any[] = [];
        let kids: any[] = manywho.model.getChildren(container.id, this.props.flowKey);
        kids.forEach((kid: any) => {
            let button: any;
            if(kid.attributes?.icon) {
                button=(
                    <span
                        className={"colcon-expander-button-icon glyphicon glyphicon-" + kid.attributes?.icon}
                    />
                );
            }
            else {
                button=(
                    <span
                        className={"colcon-expander-button-icon"}
                    >
                        {kid.developerName}
                    </span>
                );
            }
            buttons.push(
                <div
                    id={kid.id}
                    className='colcon-expander-button'
                    onClick={(e:any) => {this.buttonClicked(kid.id)}}
                    title={kid.label || kid.developerName}
                >
                    {button}
                </div>
                
            );
        });

        return(
            <div
                className='colcon-expander'
            >
                <div
                    className='colcon-expander-buttoncol'
                >
                    {buttons}
                </div>
            </div>
        );
    }

    buildExpandedContent(container: any) {
  
        let buttons: any[] = [];
        
        let childContainers: any[] = manywho.model.getChildren(container.id, this.props.flowKey);
        childContainers.forEach((kid: any) => {
            let button: any;
            if(kid.attributes?.icon) {
                button=(
                    <span
                        className={"colcon-expander-button-icon glyphicon glyphicon-" + kid.attributes?.icon}
                    />
                );
            }
            else {
                button=(
                    <span
                        className={"colcon-expander-button-icon"}
                    >
                        {kid.developerName}
                    </span>
                );
            }
            buttons.push(
                <div
                    id={kid.id}
                    onClick={(e:any) => {this.buttonClicked(kid.id)}}
                    title={kid.label || kid.developerName}
                    className='colcon-expander-button'
                >
                    {button}
                </div>
                
            );
        });
        buttons.unshift(
            <div
                className='colcon-expander-button'
                onClick={(e:any) => {this.closeExpander()}}
                title={"Close"}
            >
                <span
                    className={"colcon-expander-button-icon glyphicon glyphicon-remove"}
                />
            </div>
            
        );

        let style: CSSProperties = {
            flexBasis: this.expandedWidth
        };

        let cont: any = manywho.model.getContainer(this.state.selectedExpander, this.props.flowKey);
        let content: any = this.buildStandardContent(cont, this.props.flowkey);
        
        return(
            <div
                className='colcon-expander colcon-expander-open'
                style={style}
            >
                <div
                    className='colcon-expander-buttonrow'
                >
                    {buttons}
                </div>
                <div
                    className='colcon-expander-content'
                >
                    {cont.label || cont.developerName}
                    {content}
                </div>
            </div>
        );
    }
}

manywho.component.registerContainer('Collapse', Collapse);