var C = require('circui').Circle;
var I = require('intui').Slide;
var connect = require('react-redux').connect;
var CLoader = require('circui').Loader;
var s = require('../data/store.js');
var ParamWidget = require('./ParamWidget');
var CircleMixin = require('circui').Mixin;


var SaveWidget = React.createClass({

	mixins: [CircleMixin],

	getInitialState: function(){
		return {
			// done: false
		}
	
	},

	componentWillReceiveProps: function(props){
		
		//default back to start
		if(!this.props.saving_piece && !props.saving_piece){
			this.refs.loader.setState({
				ease:Power2.easeOut,
				d: 1,
				c_r: 0, c_g: 255, c_b: 235,
				angle_start:0, angle_end: 0,
			})
			

		}

		//start save loader.
		if(!this.props.saving_piece && props.saving_piece){
			this.refs.loader.setState({
				ease:Power2.easeOut,
				d: 6,
				c_r: 0, c_g: 255, c_b: 235,
				angle_start:0, angle_end: Math.PI*1.3,
			})
			
		}

		//done save loader
		if(!props.saving_piece && this.props.saving_piece){
			this.refs.loader.setState({
				d: 1,
				c_r: 0, c_g: 235, c_b: 255,
				angle_start:0, angle_end: Math.PI*2,
			})

		}
	},

	save: function(){
		console.log("SAVE started",this.done)
		if(this.props.saving_piece) return
		if(this.props.current_piece){
			s.showStore(this.props.current_piece)
		}else{
			s.saveCurrentPiece()
		}
	},

	componentDidMount: function(){
		// console.log(this.refs['root'])
		// window.tt = this.refs['root']
	},

	render: function(){
		// console.log('curent piece ',this.props.current_piece)
		return (
			<C {...this.props} padding={0} className='share_node' ref='root' onClick={this.save}>
				<div className='share-slide-container'>
					<CLoader ref = 'loader' className='loader' color='#2F8BAD' c_r={255} c_g={255} c_b={255} radius={70/4} width={3} />
					<I slide v beta={100} ref='slide' index_pos = {this.props.current_piece != null ? 1 : 0} outerClassName='share_slide'>
						<I beta={100} innerClassName='share-slide-save'>
							<b className='icon-database' />
						</I>
						<I beta={100} innerClassName='share-slide-view'>
							<b className='icon-picture' />
						</I>	
					</I>
				</div>
			</C>
		)
	}
})











var UserWidget = React.createClass({

	componentDidMount: function(){
		window.widget = this;
		this.refs.param_widget.initDragger(this.refs.canvas);

	},

	componentDidUpdate: function(props,state){
		this.syncCanvasDragger();
	},

	syncCanvasDragger: function(){
		var canvas_pos = this.refs.canvas.getBoundingClientRect();
		this.refs.canvas.width = this.refs['root'].clientWidth;
		this.refs.canvas.height = this.refs['root'].clientHeight;
		this.refs.param_widget.dragger.stage['vertical'] = this.refs.canvas.height > this.refs.canvas.width ? true : false
		this.refs.param_widget.dragger.stage['left'] = canvas_pos.left
		this.refs.param_widget.dragger.stage['top'] = canvas_pos.top
	},

	getInitialState: function(){
		return {
			expanded: false,
		}
	},

	toggleRoot: function(){
		if(!this.props.current_type) return


		if(this.props.saving_piece) return
		if(this.props.save_sharing){
			s.toggleSaveShare(false)
		}

		
		this.setState({
			expanded: !this.state.expanded,
			params_expanded : !this.state.expanded
		})
	},

	//decide whether to expand the params or not based on whether we are saving.
	paramState: function(){
		
		if(this.props.saving_piece == true) return false
		if(!this.state.expanded) return false
		return true

	},

	setLike: function(){
		console.log("set like")
		if(this.props.current_piece != null){
			if(this.props.liked_pieces.indexOf(this.props.current_piece.id) != -1){
				s.removeLike(this.props.current_piece)
			}else{
				s.setLike(this.props.current_piece)
			}
			
		}
	},


	render: function(){
		var scale = 1;
		var bg = ''
		if(this.props.current_piece != null){
			if(this.props.liked_pieces.indexOf(this.props.current_piece.id) != -1){
				scale = 0.9
				bg = 'active'
			}
			
			
		
		}else{
			scale = 0
		}
		
		return (
			<div className = 'user-widget' ref = 'root'  >
				<canvas  tabIndex='1' ref='canvas' className = 'user-widget-canvas' />
				<C padding = {6} rootStyle={{top:'50%'}} rootClass = 'user-widget-dom' ref='root_node' expanded={this.state.expanded} onClick={this.toggleRoot} size={85} angle = {-Math.PI/2} >
					<b className='icon-cog' />
					<C distance={1.2}  beta = {45} scale={scale} selfClass={"love_node "+bg} ref='love_node' onClick={this.setLike}>
						<b className='icon-heart' style={{color: ((this.props.current_piece != null && this.props.liked_pieces.indexOf(this.props.current_piece.id) != -1) ? '#FF0072' : 'black')}}/>
					</C>
					<ParamWidget distance={1.3} beta={100} ref='param_widget' expanded={ this.paramState() } params={this.props.params} current_type = {this.props.current_type} save_sharing={this.props.save_sharing} />
					<SaveWidget distance={1.2} beta={45} ref='save_widget' saving_piece={this.props.saving_piece} current_piece={this.props.current_piece}/>
				</C>
			</div>
		)
	}
});

module.exports = UserWidget
