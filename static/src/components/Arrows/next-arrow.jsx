import React , {Component} from "react";

class NextArrow extends Component{
    constructor(props){
        super(props)
    }
    render(){
        let {onClick, style, className} = this.props;
        className = className.split(" ").filter(el => {
            return (el == "slick-disabled")
        });
        return(
            <div className={className + " tvp-carousel-arrow next"} onClick={onClick}>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z" />
                    <path d="M0-.25h24v24H0z" fill="none" />
                </svg>
            </div>
        );
    }
}
export default NextArrow;