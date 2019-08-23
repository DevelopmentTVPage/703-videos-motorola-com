"use strict";
Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Tip = function Tip(props) {
  var direction = props.direction;

  var size = props.size || 24;
  var isPortrait = direction === "up" || direction === "down";
  var mainLength = size;
  var crossLength = size * 2;
  var points = direction === "up" ? "0," + mainLength + " " + mainLength + ",0, " + crossLength + "," + mainLength : direction === "down" ? "0,0 " + mainLength + "," + mainLength + ", " + crossLength + ",0" : direction === "left" ? mainLength + ",0 0," + mainLength + ", " + mainLength + "," + crossLength : "0,0 " + mainLength + "," + mainLength + ", 0," + crossLength;
  var svgProps = {
    className: "Popover-tip",
    width: isPortrait ? crossLength : mainLength,
    height: isPortrait ? mainLength : crossLength
  };
  
  
  let polygon = _react2.default.createElement("polygon",{id:"b",key:"polygon", points:"2370 681 2354 697 2354 665"},null);
  let feOffset = _react2.default.createElement("feOffset", {dx:"2", key:"feOffset", dy:"4", in:"SourceAlpha", result:"shadowOffsetOuter1"},null);
  let feGaussianBlur = _react2.default.createElement("feGaussianBlur",{in:"shadowOffsetOuter1", key:"feGaussianBlur", result:"shadowBlurOuter1", stdDeviation:"4"},null);
  let feComposite = _react2.default.createElement("feComposite",{key:"feComposite",in:"shadowBlurOuter1", in2:"SourceAlpha", operator:"out", result:"shadowBlurOuter1"},null);
  let feColorMatrix = _react2.default.createElement("feColorMatrix",{key:"feColorMatrix",in:"shadowBlurOuter1", values:"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"},null);
  let filter = _react2.default.createElement("filter",{key:"filter"},[feOffset,feGaussianBlur,feComposite,feColorMatrix]);
  let defs = _react2.default.createElement("defs",{key:"refs"},[polygon,filter]);
  let use = _react2.default.createElement("use",{key:"use",fill:"black", filter:"url(#a)", xlinkHref:"#b"},null);
  let use2 = _react2.default.createElement("use",{key:"use2",fill:"#FFFFFF", xlinkHref:"#b"},null);
  let path = _react2.default.createElement("path",{key:"path",stroke:"#ccc", strokeWidth:"1.5", d:"M2372.93934,681 L2350.75,658.81066 L2350.75,703.18934 L2372.93934,681 Z"},null);
  let g = _react2.default.createElement("g",{key:"g",fill:"white", fillRule:"evenodd", transform:"translate(-2348 -662)"},[use,use2,path]);
  let svg = _react2.default.createElement("svg",{className:"Popover-tip",width:"25",xmlns:"http://www.w3.org/2000/svg", xmlnsXlink:"http://www.w3.org/1999/xlink", height:"45", viewBox:"10 0 31 46"},[defs,g]);
  return svg;
  
};

exports.default = Tip;