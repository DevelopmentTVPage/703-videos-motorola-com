export class Analytics{
  constructor(){

  }
  productImpresion(product){
    var data = {
      vd : product.entityIdParent,
      ct : product.id,
      li : TVSite.loginId,
      pg : TVSite.channelId
    };
    this.sendAnalytics("pi",data);
  }
  productClick(product){
    var data = {
      vd : product.entityIdParent,
      ct : product.id,
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
