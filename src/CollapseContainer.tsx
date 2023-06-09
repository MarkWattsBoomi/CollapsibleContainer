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

    async buttonClicked(containerId: string){
        const outcomes: Map<string,any> = new Map();
        let trigger: boolean = this.state.selectedExpander === undefined;
        this.setState({selectedExpander: containerId});
        if(trigger) {
            manywho.model.getOutcomes(this.expanderParentId, this.props.flowKey).forEach((outcome: any)=>{
                outcomes.set(outcome.developerName, outcome);
            });
            
            if(outcomes.has("onExpand")){
                await manywho.component.onOutcome(outcomes.get("onExpand"),null,this.props.flowKey);
            }
        }
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
               content.push(this.buildStandardContent(kid, this.props.flowKey, false)); 
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

    buildStandardContent(item: any, flowKey: string, includeOutcomes: boolean = true, includeTitle: boolean=true) {
        let content: any;
        const Outcome : any = manywho.component.getByName("outcome");
        let label = null;
        if (item.label) {
            label = <h3>{item.label}</h3>;
        }
        let outcomeButtons: any;
        if(includeOutcomes) {
            const outcomes = manywho.model.getOutcomes(item.id, this.props.flowKey);
            outcomeButtons = outcomes && outcomes.map((outcome: any) => {
                return <Outcome id={outcome.id} flowKey={this.props.flowKey} />;
            });
        }
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
                    {includeTitle? label : undefined}
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
            if(manywho.model.isContainer(kid)) {
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
            }
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
        let tabs: any[] = [];
        //get any non tab page elements
        let commonElements: any[] = manywho.model.getChildren(this.expanderParentId, this.props.flowKey);
        let topElements: any[] = [];
        for(let element of commonElements) {
            if(!manywho.model.isContainer(element)) {
                topElements.push(this.buildStandardContent(element, this.props.flowKey));
            }
        }
        
        let childContainers: any[] = manywho.model.getChildren(container.id, this.props.flowKey);
        childContainers.forEach((kid: any) => {
            if(manywho.model.isContainer(kid)) {
                
                let tabClass: string = "colcon-expander-tab";
                if(this.state.selectedExpander === kid.id) {
                    tabClass += " colcon-expander-tab-selected";
                }
                let tab = (
                    <span
                        className={tabClass}
                        onClick={(e:any) => {this.buttonClicked(kid.id)}}
                    >
                        {kid.label || kid.developerName}
                    </span>
                );
                tabs.push(tab);
            }
        });
        buttons.unshift(
            <div
                className='colcon-expander-button'
                onClick={(e:any) => {this.closeExpander()}}
                title={"Close"}
            >
                <span
                    className={"colcon-expander-button-icon glyphicon glyphicon-remove-sign"}
                />
            </div>
            
        );

        let style: CSSProperties = {
            flexBasis: this.expandedWidth
        };

        let cont: any = manywho.model.getContainer(this.state.selectedExpander, this.props.flowKey);
        let content: any = this.buildStandardContent(cont, this.props.flowkey,true,false);
        
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
                    className='colcon-expander-body'
                >
                    {topElements}
                    <div
                        className='colcon-expander-tabs'
                    >
                        {tabs}
                    </div>
                    <div
                        className='colcon-expander-content'
                    >
                        <div
                            className='colcon-expander-scroller'
                        >
                            {content}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

manywho.component.registerContainer('Collapse', Collapse);