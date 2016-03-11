var Note = React.createClass({
    getInitialState: function(){
        return {
            editing: false
        }
    },
    edit: function() {
        this.setState({editing:true});
    },
    remove: function() {
        this.setState({editing:false});
        this.props.onRemove(this.props.index);
    },
    save: function () {
        this.props.onChange(this.refs.newText.getDOMNode().value, this.props.index);
        // var val = this.refs.newText.getDOMNode().value;
        // alert('Save note: '+val);
        this.setState({editing:false});
    },
    componentWillMount: function(){//componentWillMount will fire right before the first render
        this.style = {
            right: this.randomBetween(0,window.innerWidth-150) + 'px',
            top: this.randomBetween(0, window.innerHeight-150) + 'px',
            transform: 'rotate('+this.randomBetween(-15,15)+'deg'
        };
    },
    componentDidMount: function(){
        $(this.getDOMNode()).draggable();
    },
    randomBetween: function(min, max){
        return ( min + Math.ceil( Math.random()*max ) );
    },
    renderDisplay: function(){//render form
         return ( 
                <div className='note' style={this.style} >
                    <p>{this.props.children}</p>
                    <span>
                        <button onClick={this.edit}
                                className="btn btn-primary glyphicon glyphicon-pencil"/>
                        <button onClick={this.remove}
                                className="btn btn-danger glyphicon glyphicon-trash"/>
                    </span>
                </div> 
                );
    },
    renderForm: function(){
        return (
            <div className='note' style={this.style}>
                <textarea ref='newText' defaultValue={this.props.children} className='form-control' />
                
                <button onClick={this.save}
                        className="btn btn-success btn-sm glyphicon glyphicon-floppy-disk" />
            </div>
        );
    },//renderForm
    render: function() {
       if ( this.state.editing ) {
            return this.renderForm();
       }else{
            return this.renderDisplay();
       }
    }//render
});




//board is the parent of note
var Board = React.createClass({
    getInitialState: function () {
      return {
            notes: []
        };
    },
    //child components can inherit state form their parents, they also can inherit props
    update: function (newText,i) {
        var arr = this.state.notes;
        arr[i].note = newText;
        this.setState({notes:arr});  
    },
    remove: function (i) {
        var arr = this.state.notes;
        arr.splice(i, 1); //remove the ith element in an array
        this.setState({notes:arr});
    },
    add: function(text){
        var arr = this.state.notes;
        arr.push({
            id: this.nextId(),
            note:text
        });
        this.setState({notes:arr});
    },
    componentWillMount: function(){//componentWillMount will fire right before the first render
        var self = this;
        if(this.props.count) {
            $.getJSON("http://baconipsum.com/api/?type=all-meat&sentences=" + this.props.count
            +"&start-with-lorem=1&callback=?",function(results){
                results[0].split('. ').forEach(function(sentence){
                    self.add(sentence.substring(0,40)); 
                });
            });
        }
    },
    eachNote: function (note,i) {  // prototype of js map function
        return (
            <Note key={note.id} 
                index={i}
                onChange = {this.update}
                onRemove = {this.remove}
            > {note.note} </Note>
        );
    },
    nextId: function(){
        this.uniqueId = this.uniqueId || 0;
        return this.uniqueId++;
    },
    PropTypes : {// PropTypes is a method that's part of the React library and it helps us to handle validation
        count : function (props, propsName){
            if (props[propsName] !=='number' ) {
                return new Error('the count property type must be a number');
            }
            if ( props[propsName]>100 ) {
                return new Error('creating '+props[propsName]+' note is ridiculous');
            }
        }
    },
    render: function(){
        return (<div className='board' > 
            {this.props.count}
            {this.state.notes.map(this.eachNote)} 
            }
            <button className='btn btn-sm btn-success glyphicon glyphicon-plus'  
                onClick={this.add.bind(null,'new note')} //it's adding some placeholder text every time we fire the this.add function. So when we add a new item to our array, it will always have New Note bound to each new note. 
            />
        </div>);
    }
});







var Checkbox = React.createClass({
    getInitialState: function(){
        return {checked:false}
    }, 
    handleCheck: function(){
        this.setState({ checked: !this.state.checked }) //help to toggle on/off
    }, 
    render: function(){
        var msg;
        if (this.state.checked) {
            msg='checked';
        }else{
            msg='unchecked';
        }
        return (
            <div> <input type="checkbox" onChange={this.handleCheck} defaultChecked={this.state.checked} />
                <p> this box is {msg} </p>
            </div>
        );
    }
});


React.render( <div> 
                <Checkbox />
                <Board count={20}> </Board>
              </div>,
    document.getElementById('react-container') 

);//render


