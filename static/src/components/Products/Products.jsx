import React, {Component} from "react";
import "./Products.scss";
import Analytics from "../../libs/analytics";
import Common from "../../utils/common";
import Slider from "react-slick";
import NextArrow from "../Arrows/next-arrow";
import PrevArrow from "../Arrows/prev-arrow";
import ClampLines from '../../libs/react-clamp-lines';

export default class Products extends Component {
    constructor(props) {
        super(props);
    }

    mapProducts(element, index) {
        Common.createProductStructureData(element);
        Analytics.productImpresion(element);
        const elStyle = {
            backgroundImage: `url(${element.entity.data.imageUrl})`
        };

        let learnMoreLink = element.entity.data.linkUrl;

        if(learnMoreLink.indexOf("#") > 1){
            learnMoreLink = element.entity.data.linkUrl.split("#").shift();
        }
        
        return (<div className="product-item" key={index}>
            <div className="row">
                <div className="col-md-6 product-item-image-container">
                    <div className="product-item-image" style={elStyle}></div>
                    <div className="product-item-title">{element.entity.title}</div>
                   <div className="product-item-cta-wrapper">
                       <a onClick={() => Analytics.productClick(element)} href={element.entity.data.linkUrl} target="_blank" className="product-item-cta">
                           <div>{element.entity.data.actionText || "Buy Now"}</div>
                       </a>
                       <a className="product-item-learn-more" href={learnMoreLink}>Learn More</a>
                   </div>

                </div>
                <div className="col-md-6 product-item-meta-container">
                    <p className="product-item-meta-headline">specifications</p>
                    <div className="product-item-meta-os">OS
                        <div>{element.entity.data.os || "N/A"}</div>
                    </div>
                    <div className="product-item-meta-processor">processor
                        <div><ClampLines
                            lines={2}
                            ellipsis="..."
                            buttons={false}
                            id="product-item-meta-processor"
                            text={element.entity.data.processor || "N/A"}/></div>
                    </div>
                    <div className="product-item-meta-ram">memory (RAM)
                        <div>{element.entity.data.memory || "N/A"}</div>
                    </div>
                    <div className="product-item-meta-internal-storage">internal storage
                        <div>{element.entity.data.int_storage || "N/A"}</div>
                    </div>
                    <div className="product-item-meta-expandable-storage">expandable storage
                        <div>{element.entity.data.exp_storage || "N/A"}</div>
                    </div>
                </div>
            </div>
        </div>)
    }

    render() {
        const {products} = this.props,
            settings = {
                dots: true,
                dotsClass: 'tvp-slick-dots slick-dots',
                infinite: false,
                slidesToShow: 1,
                slidesToScroll: 1,
                nextArrow: <NextArrow/>,
                prevArrow: <PrevArrow/>,
            };

        return (
            <div className="products-container col-md-4">
                <div className="row">
                    <div className="col-md-12 product-item-headline">
                        <span>PHONE IN THIS VIDEO</span>
                    </div>
                    {products &&
                    <div className="col-md-12 products-slick-carousel">
                        <Slider {...settings}>{products.map(this.mapProducts.bind(this))}</Slider>
                    </div>
                    }
                </div>
            </div>
        );
    }
}