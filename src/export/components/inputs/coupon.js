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
		this.state = { 
			open: false,
			isValid: false,
		}
		this.open = this.open.bind(this)
		this.handleChange = this.handleChange.bind(this)
	}
	open() {
		this.setState({ open: true })
		setTimeout(() => {
			this.input.focus()
		}, 1)
	}

	handleChange(e) {
		console.log(`e.target.value:`, e.target.value)
		console.log(`this: `, this.props.couponVerify)
		// TODO handle correctly here
		if(this.props.couponVerify){
			this.setState({ isValid: this.props.couponVerify(e.target.value) })
		}
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
						<span>Coupon is {isValid ? ``: `in`}valid</span>
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