import './App.css';
import React from 'react';

class Visualization extends React.Component {
//     constructor(props) {
//         super(props);
//     }

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
//     constructor(props) {
//         super(props);
//     }

    render() {
        return (
            <div className="Components">
                <ul>
                    {this.props.value.map(component => {
                        switch(component.type) {
                            case "Bodytube":
                                return <Bodytube key={component.key} value={component} changeLength={this.props.changeLength} />
                            case "Nosecone":
                                return <Nosecone key={component.key} value={component} changeLength={this.props.changeLength} changeDiameter={this.props.changeDiameter}/>
                            case "Transition":
                                return <Transition key={component.key} value={component} changeLength={this.props.changeLength} changeAftDiameter={this.props.changeAftDiameter}/>
                            case "Fin set":
                                return <FinSet key={component.key} value={component}
                                    changeRootChord={this.props.changeRootChord}
                                    changeTipChord={this.props.changeTipChord}
                                    changeSemiSpan={this.props.changeSemiSpan}
                                    changeSweep={this.props.changeSweep}
                                    changeNumber={this.props.changeNumber}
                                    changePosition={this.props.changePosition}
                                />
                            default:
                                return;
                        }
                    })}
                </ul>
                <button>Add body tube</button> &#x2001; <button>Add transition</button>
            </div>
        );
    }
}

class Nosecone extends React.Component {
//     constructor(props) {
//         super(props);
//     }

    render() {
        return (
            <li componentkey={this.props.value.key}>{this.props.value.type} &#x2001;
                Diam. <input size="2" value={this.props.value.diameter} onChange={this.props.changeDiameter} /> &#x2001;
                Length <input size="2" value={this.props.value.length} onChange={this.props.changeLength} /> &#x2001;
                <button>remove</button>
            </li>
        );
    }
}

class Bodytube extends React.Component {
//     constructor(props) {
//         super(props);
//     }

    render() {
        return (
            <li componentkey={this.props.value.key}>{this.props.value.type} &#x2001;
                Diam. {this.props.value.diameter} &#x2001;
                Length <input size="2" value={this.props.value.length} onChange={this.props.changeLength} /> &#x2001;
                <button>remove</button>
            </li>
        );
    }
}

class Transition extends React.Component {
//     constructor(props) {
//         super(props);
//     }

    render() {
        return (
            <li componentkey={this.props.value.key}>{this.props.value.type} &#x2001;
                Front diam. {this.props.value.frontDiameter} &#x2001;
                Aft diam. <input size="2" value={this.props.value.aftDiameter} onChange={this.props.changeAftDiameter} /> &#x2001;
                Length <input size="2" value={this.props.value.length} onChange={this.props.changeLength} /> &#x2001;
                <button>remove</button>
            </li>
        );
    }
}

class FinSet extends React.Component {
//     constructor(props) {
//         super(props);
//     }

    render() {
        return (
            <li componentkey={this.props.value.key}>{this.props.value.type} &#x2001;
                Root <input size="2" value={this.props.value.rootChord} onChange={this.props.changeRootChord} /> &#x2001;
                Tip <input size="2" value={this.props.value.tipChord} onChange={this.props.changeTipChord} /> &#x2001;
                Semi-span <input size="2" value={this.props.value.semiSpan} onChange={this.props.changeSemiSpan} /> &#x2001;
                Sweep <input size="2" value={this.props.value.sweep} onChange={this.props.changeSweep} /> &#x2001;
                Number <input size="2" value={this.props.value.number} onChange={this.props.changeNumber} /> &#x2001;
                from bottom <input size="2" value={this.props.value.positionFromBottom} onChange={this.props.changePosition} />
                <button>remove</button>
            </li>
        );
    }
}

class Name extends React.Component {
//     constructor(props) {
//         super(props);
//     }

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
                { "key": 2, "type": "Bodytube", "length": 800, "diameter": 25 },
                { "key": 3, "parent": 2, "type": "Fin set", "rootChord": 50, "tipChord": 30, "semiSpan": 50, "sweep": 30, "number": 6, "positionFromBottom": 0 },
                { "key": 4, "type": "Transition", "length": 40, frontDiameter: 25, aftDiameter: 18 },
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

    changeDimension(dimension, event) {
        const componentKey = event.target.parentElement.attributes.componentkey.value;
        let components = this.state.components.map(component => {
            if(component.key == componentKey) {
                return Object.assign(component, { [dimension]: event.target.value });
            } else {
                return component;
            }
        });
        this.setState({ components: components });
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
                    />
                </div>
                <Visualization value={this.state}/>
            </div>
        );
    }
}

export default App;
