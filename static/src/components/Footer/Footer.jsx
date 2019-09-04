import React, {Component} from "react";

export default class Footer extends Component {
    render() {
        return (<footer className="footer">
            <div className="footer-wrap region-dark-footer">
                <div className="container-fluid">
                    <div className="row">

                        <div className="col-md-6 text-center"
                             style={{left: "50%", transform: "translateX(-50%)"}}>
                            <div className="region region-dark-footer-left" style={{
                                display: "flex",
                                justifyContent: "center",
                                flexDirection: "column",
                                alignItems: "center"
                            }}>
                                <section id="block-block-3"
                                         className="block block-block footer-img-logo col-md-12 clearfix">


                                    <div><img alt="Motorola a Lenovo company" className="footer-img-logo"
                                              src="//motorola.com/sites/all/themes/custom/motorola_bootstrap/images/motorola_footer_logo.svg"/>
                                    </div>

                                </section>
                                <section id="block-motorola-footer-motorola-footer-change-location"
                                         className="block block-motorola-footer motorola-footer-change-location clearfix">
                                    <ul style={{display: "flex"}}>
                                        <li><a href="https://www.motorola.com/">Motorola.com</a></li>
                                        <li>|</li>
                                        <li><a href="https://www.motorola.com/">Terms of Use</a></li>
                                        <li>|</li>
                                        <li><a href="https://www.motorola.com/">Privacy</a></li>
                                    </ul>

                                </section>
                                <section id="block-bean-copyright-footer"
                                         className="block block-bean copyright-block col-md-12 clearfix"
                                         style={{padding: 0}}>


                                    <div className="entity entity-bean bean-copyright-footer clearfix"
                                         about="//motorola.com/us/block/copyright-footer">

                                        <div className="content">
                                            <div
                                                className="field field-name-field-copyright-content field-type-text-long field-label-hidden">
                                                <div className="field-items">
                                                    <div className="field-item even">
                                                        <p>Motorola Mobility LLC. All Rights Reserved</p>
                                                        <p>Motorola and the Stylized M are registered trademarks of
                                                            Motorola trademark Holdings, LLC.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </section>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </footer>)
    }
}

