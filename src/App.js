import './App.css';
import React from 'react';

class Visualization extends React.Component {
    drawFin(component, startX, finSet, angle) {
        let xRootTrail = startX + component.length - finSet.positionFromBottom;
        let yRootTrail = -1.0 * component.diameter / 2.0 * Math.cos(angle);
        let xRootLead = xRootTrail - finSet.rootChord;
        let yRootLead = yRootTrail;
        let xTipLead = xRootLead + finSet.sweep;
        let yTipLead = yRootLead - finSet.semiSpan * Math.cos(angle);
        let xTipTrail = xTipLead + finSet.tipChord;
        let yTipTrail = yTipLead;
        let z = Math.sin(angle);
        return (
            <polygon className="part" points={xRootTrail+","+yRootTrail+" "+xRootLead+","+yRootLead+" "+xTipLead+","+yTipLead+" "+xTipTrail+","+yTipTrail} z={z} />
        )
    }

    drawBodytube(component, startX) {
        let x = startX;
        let y = -1.0 * component.diameter / 2.0;
        let width = component.length;
        let height = component.diameter;
        let finSetVisualizations = [];
        if(component.finSets.length > 0) {
            for(let finSet of component.finSets) {
                let numberOfFinsToDraw = Math.floor(finSet.number / 2.0) + 1;
                let angleBetweenFins = 2.0 * Math.PI / finSet.number;
                for(let i = 0; i < numberOfFinsToDraw; i++) {
                    finSetVisualizations.push(this.drawFin(component, startX, finSet, i * angleBetweenFins));
                }
            }
        }
        return (
            <g z="0">
                <rect className="part" x={x} y={y} width={width} height={height} z="0" />
                {finSetVisualizations.sort((a, b) => Number(a.props.z) - Number(b.props.z))}
            </g>
        )
    }

    drawNosecone(component, startX) {
        let x0 = startX;
        let y0 = 0;
        let x1 = startX + component.length;
        let y1 = -1.0 * component.diameter / 2.0;
        let x2 = x1;
        let y2 = y1 + component.diameter;
        return (
            <polygon className="part" points={x0+","+y0+" "+x1+","+y1+" "+x2+","+y2} z="-1" />
        )
    }

    drawTransition(component, startX) {
        let x0 = startX;
        let y0 = 1.0 * component.frontDiameter / 2.0;
        let x1 = startX;
        let y1 = y0 - component.frontDiameter;
        let x2 = startX + component.length;
        let y2 = -1.0 * component.aftDiameter / 2.0;
        let x3 = x2;
        let y3 = y2 + component.aftDiameter;
        return (
            <polygon className="part" points={x0+","+y0+" "+x1+","+y1+" "+x2+","+y2+" "+x3+","+y3} z="-1" />
        )
    }

    drawComponent(component, startX) {
        if(component.type == "Bodytube") {
            return this.drawBodytube(component, startX);
        } else if(component.type == "Nosecone") {
            return this.drawNosecone(component, startX);
        } else if(component.type == "Transition") {
            return this.drawTransition(component, startX);
        }
    }

    drawComponents(componentList) {
        let currentX = 0;
        let componentVisualization = [];
        for(let component of componentList) {
            componentVisualization.push(this.drawComponent(component, currentX));
            currentX += component.length;
        }
        return componentVisualization.sort((a, b) => Number(a.props.z) - Number(b.props.z));
    }

    render() {
        return (
            <div className="Visualization">
                <p>Barrowman: {this.props.value.stabilityMargin}</p>
                <svg id="visualization" viewBox="-10 -200 1020 400" preserveAspectRatio="xMidYMid meet">{
                    this.drawComponents(this.props.value.components)
                }</svg>
            </div>
        );
    }
}

class Components extends React.Component {
    render() {
        return (
            <div className="Components">
                <ul>
                    {this.props.value.map(component => {
                        switch(component.type) {
                            case "Bodytube":
                                return <Bodytube key={component.key} 
                                        selected={this.props.selected}
                                        selectComponent={this.props.selectComponent}
                                        value={component} 
                                        addFinSet={this.props.addFinSet}
                                        removeComponent={this.props.removeComponent}
                                        changeLength={this.props.changeLength} 
                                        changeRootChord={this.props.changeRootChord}
                                        changeTipChord={this.props.changeTipChord}
                                        changeSemiSpan={this.props.changeSemiSpan}
                                        changeSweep={this.props.changeSweep}
                                        changeNumber={this.props.changeNumber}
                                        changePosition={this.props.changePosition}
                                    />
                            case "Nosecone":
                                return <Nosecone key={component.key} 
                                        selected={this.props.selected == component.key ? this.props.selected : null}
                                        selectComponent={this.props.selectComponent}
                                        value={component} 
                                        removeComponent={this.props.removeComponent}
                                        changeLength={this.props.changeLength} 
                                        changeDiameter={this.props.changeDiameter}
                                    />
                            case "Transition":
                                return <Transition key={component.key} 
                                        selected={this.props.selected == component.key ? this.props.selected : null}
                                        selectComponent={this.props.selectComponent}
                                        value={component} 
                                        removeComponent={this.props.removeComponent}
                                        changeLength={this.props.changeLength} 
                                        changeAftDiameter={this.props.changeAftDiameter}/>
                            default:
                                return;
                        }
                    })}
                </ul>
                <p>
                    <button onClick={this.props.addBodyTubeAfter}>Add body tube after selection</button> &#x2001; 
                    <button onClick={this.props.addTransitionAfter}>Add transition after selection</button>
                </p>
            </div>
        );
    }
}

class Nosecone extends React.Component {
    render() {
        return (
            <li componentkey={this.props.value.key} 
                className={this.props.selected ? "selected" : null}
                onClick={this.props.selectComponent}
            >
                {this.props.value.type} &#x2001;
                Diam. <input size="2" value={this.props.value.diameter} onChange={this.props.changeDiameter} /> &#x2001;
                Length <input size="2" value={this.props.value.length} onChange={this.props.changeLength} /> &#x2001;
            </li>
        );
    }
}

class Bodytube extends React.Component {
    render() {
        const hasFinSets = this.props.value.finSets.length > 0;

        return (
            <li componentkey={this.props.value.key} 
                className={this.props.selected == this.props.value.key ? "selected" : null}
                onClick={this.props.selectComponent}
            >
                {this.props.value.type} &#x2001;
                Diam. {this.props.value.diameter} &#x2001;
                Length <input size="2" value={this.props.value.length} onChange={this.props.changeLength} /> &#x2001;
                <button onClick={this.props.addFinSet}>add fin set</button> &#x2001;
                <button onClick={this.props.removeComponent}>remove</button>
                {hasFinSets &&
                    <FinSetList value={this.props.value.finSets}
                        selected={this.props.selected}
                        selectComponent={this.props.selectComponent}
                        removeComponent={this.props.removeComponent}
                        changeRootChord={this.props.changeRootChord}
                        changeTipChord={this.props.changeTipChord}
                        changeSemiSpan={this.props.changeSemiSpan}
                        changeSweep={this.props.changeSweep}
                        changeNumber={this.props.changeNumber}
                        changePosition={this.props.changePosition}
                    />
                }
            </li>
        );
    }
}

class Transition extends React.Component {
    render() {
        return (
            <li componentkey={this.props.value.key} 
                className={this.props.selected ? "selected" : null}
                onClick={this.props.selectComponent}
            >
                {this.props.value.type} &#x2001;
                Front diam. {this.props.value.frontDiameter} &#x2001;
                Aft diam. <input size="2" value={this.props.value.aftDiameter} onChange={this.props.changeAftDiameter} /> &#x2001;
                Length <input size="2" value={this.props.value.length} onChange={this.props.changeLength} /> &#x2001;
                <button onClick={this.props.removeComponent}>remove</button>
            </li>
        );
    }
}

class FinSetList extends React.Component {
    render() {
        return (
            <ul>
                {this.props.value.map(finSet => {
                    return <FinSet key={finSet.key} value={finSet}
                        selected={this.props.selected == finSet.key ? this.props.selected : null}
                        selectComponent={this.props.selectComponent}
                        removeComponent={this.props.removeComponent}
                        changeRootChord={this.props.changeRootChord}
                        changeTipChord={this.props.changeTipChord}
                        changeSemiSpan={this.props.changeSemiSpan}
                        changeSweep={this.props.changeSweep}
                        changeNumber={this.props.changeNumber}
                        changePosition={this.props.changePosition}
                    />
                })}
            </ul>
        )
    }
}

class FinSet extends React.Component {
    render() {
        return (
            <li componentkey={this.props.value.key} 
                className={this.props.selected ? "selected" : ""}
                onClick={this.props.selectComponent}
            >
                Fin set &#x2001;
                Root <input size="2" value={this.props.value.rootChord} onChange={this.props.changeRootChord} /> &#x2001;
                Tip <input size="2" value={this.props.value.tipChord} onChange={this.props.changeTipChord} /> &#x2001;
                Semi-span <input size="2" value={this.props.value.semiSpan} onChange={this.props.changeSemiSpan} /> &#x2001;
                Sweep <input size="2" value={this.props.value.sweep} onChange={this.props.changeSweep} /> &#x2001;
                Number <input size="2" value={this.props.value.number} onChange={this.props.changeNumber} /> &#x2001;
                from bottom <input size="2" value={this.props.value.positionFromBottom} onChange={this.props.changePosition} /> &#x2001;
                <button onClick={this.props.removeComponent}>remove</button>
            </li>
        );
    }
}

class Name extends React.Component {
    render() {
        return (
            <input type="text" placeholder="Name" value={this.props.value} onChange={this.props.onChange}/>
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "name": "",
            "stabilityMargin": "n/a",
            "components": [
                { "key": 1, "type": "Nosecone", "length": 100, "diameter": 25 },
                { "key": 2, "type": "Bodytube", "length": 500, "diameter": 25,
                    "finSets": [],
                },
                { "key": 3, "type": "Transition", "length": 40, frontDiameter: 25, aftDiameter: 40 },
                { "key": 4, "type": "Bodytube", "length": 300, "diameter": 40,
                    "finSets": [
                        { "key": 6, "rootChord": 50, "tipChord": 30, "semiSpan": 50, "sweep": 30, "number": 6, "positionFromBottom": 0 },
                    ],
                },
                { "key": 5, "type": "Transition", "length": 50, frontDiameter: 40, aftDiameter: 25 },
            ],
            "selectedComponent" : null,
        };
    }

    loadConfiguration(event) {
        const file = event.target.files[0];
        if(!file) { return; }
        let reader = new FileReader();
        reader.onload = (e) => {
            let state = JSON.parse(e.target.result);
            this.setState(state);
        };
        reader.readAsText(file);
    }

    saveConfiguration() {
        const mime_type = "text/plain";

        let blob = new Blob([JSON.stringify(this.state)], {type: mime_type});

        let dlink = document.createElement('a');
        dlink.download = this.state.name.replace(/[^A-Za-z0-9-_]/g, '') + ".rkst";
        dlink.href = window.URL.createObjectURL(blob);
        dlink.onclick = function(e) {
            // revokeObjectURL needs a delay to work properly
            let that = this;
            setTimeout(function() {
                window.URL.revokeObjectURL(that.href);
            }, 1500);
        };

        dlink.click();
        dlink.remove();
    }

    updateName(event) {
        this.setState({ name: event.target.value });
    }

    calcDisplayStability() {
        const margin = -1.0 + 6.0 * Math.random();
        this.setState({
            stabilityMargin: margin
        });
    }

    verifyDiameters() {
        let currentDiameter = 0;
        let components = [];
        for (let component of this.state.components) {
            if(component.type === "Nosecone") {
                currentDiameter = component.diameter;
                components.push(component);
            } else if(component.type === "Bodytube") {
                component.diameter = currentDiameter;
                components.push(component);
            } else if(component.type === "Transition") {
                component.frontDiameter = currentDiameter;
                currentDiameter = component.aftDiameter;
                components.push(component);
            }
        }
        this.setState({ components: components });
    }

    getHighestComponentKey() {
        return this.state.components.reduce((max, component) => {
            let finMax = 0;
            if(component.type == "Bodytube") {
                finMax = component.finSets.reduce((max, finSet) => {
                    return Math.max(max, finSet.key);
                }, 0);
            }
            return Math.max(max, finMax, component.key);
        }, 0);
    }

    changeDimension(dimension, event) {
        const componentKey = event.target.parentElement.attributes.componentkey.value;
        let components = this.state.components.map(component => {
            if(component.key == componentKey) {
                return Object.assign(component, { [dimension]: Number(event.target.value) });
            } else if(component.type == "Bodytube") {
                let finSets = component.finSets.map(finSet => {
                    if(finSet.key == componentKey) {
                        return Object.assign(finSet, { [dimension]: Number(event.target.value) });
                    } else {
                        return finSet;
                    }
                });
                return Object.assign(component, { finSets: finSets });
            } else {
                return component;
            }
        });
        this.setState({ components: components }, this.verifyDiameters);
    }

    addFinSet(event) {
        let bodytubeKey = event.target.parentElement.attributes.componentkey.value;
        let components = this.state.components.map(component => {
            if(component.key == bodytubeKey) {
                component.finSets.push({ "key": this.getHighestComponentKey() + 1, "rootChord": 50, "tipChord": 30, "semiSpan": 50, "sweep": 30, "number": 6, "positionFromBottom": 0 });
            }
            return component;
        });
        this.setState({ components: components });
    }

    addBodyTubeAfter(event) {
        if(!this.state.selectedComponent) { alert('No component selected.'); return; }
        let selectedComponentIndex = this.state.components.findIndex(component => component.key == this.state.selectedComponent);
        if(selectedComponentIndex == -1) { alert('Cannot insert a bodytube after this component.'); return; }
        let components = this.state.components.slice(0);
        components.splice(selectedComponentIndex + 1, 0,
            { "key": this.getHighestComponentKey() + 1, "type": "Bodytube", "length": 500, "diameter": 25,
                "finSets": [],
            }
        );
        this.setState({ components: components }, this.verifyDiameters);
    }

    addTransitionAfter(event) {
        if(!this.state.selectedComponent) { alert('No component selected.'); return; }
        let selectedComponentIndex = this.state.components.findIndex(component => component.key == this.state.selectedComponent);
        if(selectedComponentIndex == -1) { alert('Cannot insert a transition after this component.'); return; }
        let components = this.state.components.slice(0);
        components.splice(selectedComponentIndex + 1, 0,
            { "key": this.getHighestComponentKey() + 1, "type": "Transition", "length": 40, frontDiameter: 25, aftDiameter: 40 }
        );
        this.setState({ components: components }, this.verifyDiameters);
    }

    selectComponent(event) {
        // this check at the beginning will catch a click event on a component that has just been deleted
        let componentKey = event.target.attributes.componentkey ? event.target.attributes.componentkey.value : null;
        if(!componentKey) { return; }
        let deselect = componentKey == this.state.selectedComponent;
        this.setState({ selectedComponent: deselect ? null : componentKey });
    }

    removeComponent(event) {
        let componentKey = event.target.parentElement.attributes.componentkey.value;
        let components = this.state.components.filter(component => { return component.key != componentKey});
        components = components.map(component => {
            if(component.type == "Bodytube") {
                component.finSets = component.finSets.filter(finSet => { return finSet.key != componentKey});
                return component;
            } else {
                return component;
            }
        });
        this.setState({ components: components }, this.verifyDiameters);
    }

    render() {
        return (
            <div className="App">
                <div className="Design">
                    <div className="Controls">
                        <h1>Design</h1>
                        <p><Name value={this.state.name} onChange={(event) => this.updateName(event)}/></p>
                        <p><button id="load" onClick={() => {document.getElementById('file').click();}}>Load design from file</button>
                        <input type="file" id="file" name="file" onChange={(event) => this.loadConfiguration(event)}/></p>
                        <p><button onClick={() => this.saveConfiguration()}>Save design to file</button></p>
                        <p><button onClick={() => this.calcDisplayStability()}>Calculate stability</button></p>
                    </div>
                    <Components value={this.state.components} 
                        selected={this.state.selectedComponent}
                        selectComponent={(event) => this.selectComponent(event)}
                        changeDiameter={(event) => this.changeDimension("diameter", event)}
                        changeLength={(event) => this.changeDimension("length", event)}
                        changeAftDiameter={(event) => this.changeDimension("aftDiameter", event)}
                        changeRootChord={(event) => this.changeDimension("rootChord", event)}
                        changeTipChord={(event) => this.changeDimension("tipChord", event)}
                        changeSemiSpan={(event) => this.changeDimension("semiSpan", event)}
                        changeSweep={(event) => this.changeDimension("sweep", event)}
                        changeNumber={(event) => this.changeDimension("number", event)}
                        changePosition={(event) => this.changeDimension("positionFromBottom", event)}
                        addFinSet={(event) => this.addFinSet(event)}
                        addBodyTubeAfter={(event) => this.addBodyTubeAfter(event)}
                        addTransitionAfter={(event) => this.addTransitionAfter(event)}
                        removeComponent={(event) => this.removeComponent(event)}
                    />
                </div>
                <Visualization value={this.state}/>
            </div>
        );
    }
}

export default App;
