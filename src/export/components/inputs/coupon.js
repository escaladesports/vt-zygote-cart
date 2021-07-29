import React, { Fragment } from 'react'
import Input from './input'
import Toggle from './toggle'

export default class CouponInput extends React.Component {
	static defaultProps = {
		toggleText: `Apply a Coupon`,
		label: `Coupon Code`,
		apply: false,
		name: `coupon`,
	}

	constructor(props) {
		super(props)
		this.timeOut = null

		this.state = {
			open: false,
			isValid: false,
		}

		this.open = this.open.bind(this)
		this.handleChange = this.handleChange.bind(this)
	}

	async isCouponValid(){
		const data = {coupon: this.state.coupon}

		const response = await window.fetch(this.props.api, {
			method: `POST`, // *GET, POST, PUT, DELETE, etc.
			cache: `no-cache`, // *default, no-cache, reload, force-cache, only-if-cached
			headers: {
				'Content-Type': `application/json`,
			},
			body: JSON.stringify(data), // body data type must match "Content-Type" header
		})

		return response.json() // parses JSON response into native JavaScript objects

	}

	open() {
		this.setState({ open: true })
		setTimeout(() => {
			this.input.focus()
		}, 1)
	}

	handleChange(e) {
		//automatically checks for coupon validity.
		//waits for user input to end then calls API
		this.setState({
			coupon: e.target.value,
		}, ()=>{
			if(this.timeOut){
				window.clearTimeout(this.timeOut)
				this.timeOut = this.setNewTimeOut()
			}else{
				this.timeOut = this.setNewTimeOut()
			}
		})
	}

	setNewTimeOut(){
		return setTimeout(()=>{
			this.isCouponValid().then((data)=>{
				this.setState({isValid: data.isValid},()=>{
					this.props.validCheck()
				})
			})
		}, 600)
	}

	render() {
		const { open, isValid } = this.state
		const {
			toggleText,
			label,
			step,
			apply,
			name,
			value,
		} = this.props
		return (
			<Fragment>
				<div style={{ display: open ? `none` : `block` }}>
					<Toggle onClick={this.open}>
						{toggleText}
					</Toggle>
				</div>
				<div
					style={{ display: open ? `block` : `none` }}
					className='zygoteCoupon'
				>
					<div>
						<Input
							inputRef={el => this.input = el}
							label={label}
							name={name}
							step={step}
							value={value}
							onChange={this.handleChange}
						/>
						{/* Hide/show if there is
							- function for validation
							- input length
						*/}
						<span>Coupon is {isValid ? ``: `not `}valid</span>
					</div>
					{apply && (
						<div role='button' className='zygoteCouponApply'>Apply</div>
					)}
				</div>
			</Fragment>
		)
	}
	static styles = ({ borderColor, fontColor }) => ({
		'.zygoteCoupon': {
			display: `flex`,
			'> div': {
				display: `inline-block`,
			},
		},
		'.zygoteCouponApply': {
			position: `relative`,
			top: 2,
			display: `inline-block`,
			borderRadius: 20,
			textAlign: `center`,
			padding: `8px 30px`,
			maxWidth: `100%`,
			marginLeft: 10,
			border: `1px solid ${borderColor}`,
			color: fontColor,
		},
	})
}
