import './App.css';
import React from 'react';

class Visualization extends React.Component {
    render() {
        return (
            <div className="Visualization">
                <h1>Visualization</h1>
                <p>Barrowman: {this.props.value.stabilityMargin}</p>
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
                                return <Bodytube key={component.key} value={component} 
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
                                return <Nosecone key={component.key} value={component} 
                                        removeComponent={this.props.removeComponent}
                                        changeLength={this.props.changeLength} 
                                        changeDiameter={this.props.changeDiameter}
                                    />
                            case "Transition":
                                return <Transition key={component.key} value={component} 
                                        removeComponent={this.props.removeComponent}
                                        changeLength={this.props.changeLength} 
                                        changeAftDiameter={this.props.changeAftDiameter}/>
                            default:
                                return;
                        }
                    })}
                </ul>
                <button onClick={this.props.addBodyTubeAfter}>Add body tube after selection</button> &#x2001; <button onClick={this.props.addTransitionAfter}>Add transition after selection</button>
            </div>
        );
    }
}

class Nosecone extends React.Component {
    render() {
        return (
            <li componentkey={this.props.value.key}><input type="radio" name="component" id={"component" + this.props.value.key} value={this.props.value.key} />{this.props.value.type} &#x2001;
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
            <li componentkey={this.props.value.key}><input type="radio" name="component" id={"component" + this.props.value.key} value={this.props.value.key} />{this.props.value.type} &#x2001;
                Diam. {this.props.value.diameter} &#x2001;
                Length <input size="2" value={this.props.value.length} onChange={this.props.changeLength} /> &#x2001;
                <button onClick={this.props.addFinSet}>add fin set</button> &#x2001;
                <button onClick={this.props.removeComponent}>remove</button>
                {hasFinSets &&
                    <FinSetList value={this.props.value.finSets}
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
            <li componentkey={this.props.value.key}><input type="radio" name="component" id={"component" + this.props.value.key} value={this.props.value.key} />{this.props.value.type} &#x2001;
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
            <li componentkey={this.props.value.key}>Fin set &#x2001;
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
                return Object.assign(component, { [dimension]: event.target.value });
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
        let componentSelectors = document.querySelectorAll('input[name="component"]');
        let selectedComponentKey = 0;
        for(let component of componentSelectors) {
            if(component.checked) {
                selectedComponentKey = component.value;
                break;
            }
        }
        let selectedComponentIndex = this.state.components.findIndex(component => component.key == selectedComponentKey);
        let components = this.state.components.slice(0);
        components.splice(selectedComponentIndex + 1, 0,
            { "key": this.getHighestComponentKey() + 1, "type": "Bodytube", "length": 500, "diameter": 25,
                "finSets": [],
            }
        );
        console.log("Inserted after " + selectedComponentIndex + " (key: " + selectedComponentKey + "):\n" + JSON.stringify(components));
        this.setState({ components: components }, this.verifyDiameters);
    }

    addTransitionAfter(event) {
        let componentSelectors = document.querySelectorAll('input[name="component"]');
        let selectedComponentKey = 0;
        for(let component of componentSelectors) {
            if(component.checked) {
                selectedComponentKey = component.value;
                break;
            }
        }
        let selectedComponentIndex = this.state.components.findIndex(component => component.key == selectedComponentKey);
        let components = this.state.components.slice(0);
        components.splice(selectedComponentIndex + 1, 0,
            { "key": this.getHighestComponentKey() + 1, "type": "Transition", "length": 40, frontDiameter: 25, aftDiameter: 40 }
        );
        console.log("Inserted after " + selectedComponentIndex + ":\n" + JSON.stringify(components));
        this.setState({ components: components }, this.verifyDiameters);
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
                        <Name value={this.state.name} onChange={(event) => this.updateName(event)}/><br/>
                        <input type="button" id="load" value="Load" onClick={() => {document.getElementById('file').click();}}/>
                        <input type="file" id="file" name="file" onChange={(event) => this.loadConfiguration(event)}/><br/>
                        <button onClick={() => this.saveConfiguration()}>Save</button><br/>
                        <button onClick={() => this.calcDisplayStability()}>Calculate &amp; Display Stability</button>
                    </div>
                    <Components value={this.state.components}
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
