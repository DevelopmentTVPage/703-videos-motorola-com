export class Analytics{
  constructor(){

  }
  productImpresion(product){
    var data = {
      vd : TVSite.channelVideosData.video.id,
      ct : product.product_id,
      li : TVSite.loginId,
      pg : TVSite.channelId
    };
    this.sendAnalytics("pi",data);
  }
  productClick(product){
    var data = {
      vd : TVSite.channelVideosData.video.id,
      ct : product.product_id,
      li : TVSite.loginId,
      pg : TVSite.channelId
    };
    this.sendAnalytics("pk",data);
  }
  sendAnalytics(type, data){
    if("_tvpa" in window){
      _tvpa.push(["track",type,data]);
    }
  }
}
export default new Analytics();
