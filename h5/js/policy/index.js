define(function(require, exports, module) {
    'use strict';
    let api = require('api');
    let cookie = require('cookie');
    var tip = require('tip');
    var open = require('open');
    require('tongji');
    var header = require('header');
    header.init();
    var city = {
      'bj':{
        'pureEle':{
          'section':['150≤R＜200','200≤R＜250','250≤R＜300','300≤R＜400','R≥400'],
          'money':['0.75','1.2','1.7','2.25','2.5',],
          'explain':'对符合条件的汽车，按照中央标准1∶0.5给予财政补助'
        },
        'mixtureEle':{
          'section':['R≥50'],
          'money':['1.1'],
          'explain':'对符合条件的汽车，按照中央标准1∶0.5给予财政补助'
        },
        'supplement':'政策自2018年1月1日起执行，有效期至2020年12月31日。消费者应获得的补助资金由新能源汽车生产企业或销售机构先行垫付，消费者在购车时，按扣减补助后的价格支付车价款，汽车生产企业或销售机构按扣减补助后的价格销售新能源汽车。'
      },
      'sh':{
        'pureEle':{
          'section':['150≤R＜200','200≤R＜250','250≤R＜300','300≤R＜400','R≥400'],
          'money':['0.75','1.2','1.7','2.25','2.5',],
          'explain':'对符合条件的汽车，按照中央标准1∶0.5给予财政补助'
        },
        'mixtureEle':{
          'section':['R≥50'],
          'money':['0.66'],
          'explain':'对符合条件的汽车，且发动机排量不大于1.6升的，按照中央标准1∶0.3给予财政补助'
        },
        'fuel':{
          'text':'按中央标准1∶0.5给予财政补助。燃料电池系统达到额定功率不低于驱动电机额定功率的50%，或不小于60kW的，按中央财政补助1∶1给予财政补贴。'
        },
        'supplement':'除燃料电池汽车外，国家和本市财政补助总额，原则上最高不超过车辆销售价格的50%。如补助总额高于车辆销售价格50%，在扣除中央补助后，计算本市财政补助金额。'
      },
      'cq':{
        'pureEle':{
          'section':['150≤R＜200','200≤R＜250','250≤R＜300','300≤R＜400','R≥400'],
          'money':['0.69','1.104','1.564','2.25','2.5',],
          'explain':'R≥300纯电车型约为同期国家标准的50%，其余车型为同期国家标准的46%'
        },
        'mixtureEle':{
          'section':['R≥50'],
          'money':['1.012']
        },
        'fuel':{
          'text':'燃料电池汽车补贴标准约为同期国家标准的40%'
        },
      },
      'gd':{
        'pureEle':{
          'section':['150≤R＜200','200≤R＜250','250≤R＜300','300≤R＜400','R≥400'],
          'money':['0.75','1.2','1.7','2.25','2.5',],
          'explain':'对符合条件的汽车，按照中央标准1∶0.5给予财政补助'
        },
        'mixtureEle':{
          'section':['R≥50'],
          'money':['1.1'],
          'explain':'对符合条件的汽车，按照中央标准1∶0.5给予财政补助'
        },
        'fuel':{
          'text':'燃料电池汽车地方补贴不超过国家补贴1:1比例补贴'
        },
        'supplement':'各级财政补贴资金单车的补贴总额（国家补贴加地方补贴），最高不超过车辆销售价格（国家补贴+地方补贴+消费者支付金额）的60％。'
       },
      'gz':{
        'pureEle':{
          'section':['150≤R＜200','200≤R＜250','250≤R＜300','300≤R＜400','R≥400'],
          'money':['0.75','1.2','1.7','2.25','2.5',],
          'explain':'对符合条件的汽车，按照中央标准1∶0.5给予财政补助'
        },
        'mixtureEle':{
          'section':['R≥50'],
          'money':['0.66'],
          'explain':'对符合条件的汽车，按照中央标准1∶0.3给予财政补助'
        },
        'fuel':{
          'text':'燃料电池汽车地方补贴不超过国家补贴1:1比例补贴'
        },
        'supplement':'各级财政补贴资金单车的补贴总额（国家补贴加地方补贴），最高不超过车辆销售价格（国家补贴+地方补贴+消费者支付金额）的60％。'
       },
      'xa':{
        'pureEle':{
          'section':['150≤R＜200','200≤R＜250','250≤R＜300','300≤R＜400','R≥400'],
          'money':['0.45','0.72','1.02','1.35','1.5',],
          'explain':'对符合条件的汽车，按照中央标准1∶0.3给予财政补助'
        },
        'mixtureEle':{
          'section':['R≥50'],
          'money':['0.66'],
          'explain':'对符合条件的汽车，按照中央标准1∶0.3给予财政补助'
        },
        'supplement':'对单位和个人购买新能源汽车的，首次机动车交通事故责任强制保险费用给予全额财政补贴；对新能源汽车免收125元/辆的牌照费；对具有西安户籍或持有西安市《居住证》、近两年内连续缴纳社保满1年以上，购买新能源汽车的个人，给予10000元/辆财政补贴，用于自用充电设施安装和充电费用补贴。'
       },
      'hn':{
        'pureEle':{
          'section':['150≤R＜200','200≤R＜250','250≤R＜300','300≤R＜400','R≥400'],
          'money':['0.75','1.2','1.7','2.25','2.5',],
          'explain':'对符合条件的汽车，按照中央标准1∶0.5给予财政补助'
        },
        'mixtureEle':{
          'section':['R≥50'],
          'money':['1.1'],
          'explain':'对符合条件的汽车，按照中央标准1∶0.5给予财政补助'
        },
        'supplement':'补贴由省、市县两级财政各承担50%'
       },
      'yn':{
        'pureEle':{
          'section':['150≤R＜200','200≤R＜250','250≤R＜300','300≤R＜400','R≥400'],
          'money':['0.75','1.2','1.7','2.25','2.5',],
          'explain':'对符合条件的汽车，按照中央标准1∶0.5给予财政补助'
        },
        'mixtureEle':{
          'section':['R≥50'],
          'money':['1.1'],
          'explain':'对符合条件的汽车，按照中央标准1∶0.5给予财政补助'
        },
        'supplement':'对照同期中央财政对新能源汽车的补贴标准，省级财政配套对单车补贴25%，各州市财政配套补贴上限为中央财政同期补贴标准的25%。'
       },
      'qh':{
        'pureEle':{
          'section':['150≤R＜200','200≤R＜250','250≤R＜300','300≤R＜400','R≥400'],
          'money':['0.75','1.2','1.7','2.25','2.5'],
          'explain':'按照中央标准1∶0.5给予财政补助'
        },
        'mixtureEle':{
          'section':['R≥50'],
          'money':['1.1'],
          'explain':'按照中央标准1∶0.5给予财政补助'
        }
      },
      'wh':{
        'pureEle':{
          'section':['150≤R＜200','200≤R＜250','250≤R＜300','300≤R＜400','R≥400'],
          'money':['0.75','1.2','1.7','2.25','2.5'],
          'whexplaintop':'轴距大于2.2米，按中央标准1:0.5给予补贴',
          'sectionAdd':['150≤R＜200','200≤R＜250','250≤R＜300','300≤R＜400','R≥400'],
          'moneyAdd':['0.3','0.48','0.68','0.9','1'],
          'whexplainAdd':'轴距小于等于2.2米，按中央标准1:0.2给予补贴'
        },
        'mixtureEle':{
          'section':['R≥50'],
          'money':['1.1'],
          'whexplaintop':'轴距大于2.2米，按中央标准1:0.5给予补贴',
          'sectionAdd':['R≥50'],
          'moneyAdd':['0.44'],
          'whexplainAdd':'轴距小于等于2.2米，按中央标准1:0.2给予补贴'
        },
        'fuel':{
          'text':'按中央标准1:1比例补贴'
        },
        'supplement':'各级财政补贴资金单车的补贴总额(国家补贴加地方补贴)，最高不超过车辆销售价格(国家补贴+地方补贴+消费者支付金额)的60％。'
      },
      'sx':{
        'pureEle':{
          'section':['150≤R＜200','200≤R＜250','250≤R＜300','300≤R＜400','R≥400'],
          'money':['0.75','1.2','1.7','2.25','2.5',],
          'explain':'按照中央标准1∶0.5给予财政补助'
        },
        'mixtureEle':{
          'section':['R≥50'],
          'money':['1.1'],
          'explain':'按照中央标准1∶0.5给予财政补助'
        }
      },
      'cs':{
        'pureEle':{
          'section':['150≤R＜200','200≤R＜250','250≤R＜300','300≤R＜400','R≥400'],
          'money':['0.3','0.48','0.68','0.9','1',],
          'explain':'按照中央标准1∶0.2给予财政补助'
        },
        'mixtureEle':{
          'section':['R≥50'],
          'money':['0.44'],
          'explain':'按照中央标准1∶0.2给予财政补助'
        }},
      'wz':{
         'pureEle':{
          'section':['150≤R＜200','200≤R＜250','250≤R＜300','300≤R＜400','R≥400'],
          'money':['0.75','1.2','1.7','2.25','2.5',],
          'explain':'按照中央标准1∶0.5给予财政补助'
        },
        'mixtureEle':{
          'section':['R≥50'],
          'money':['1.1'],
          'explain':'按照中央标准1∶0.5给予财政补助'
        }
      },
      'zs':{
        'pureEle':{
          'section':['150≤R＜200','200≤R＜250','250≤R＜300','300≤R＜400','R≥400'],
          'money':['0.75','1.2','1.7','2.25','2.5',],
          'explain':'按照中央标准1∶0.5给予财政补助'
        },
        'mixtureEle':{
          'section':['R≥50'],
          'money':['1.1'],
          'explain':'按照中央标准1∶0.5给予财政补助'
        }
      },
      'cd':{
        'pureEle':{
          'section':['150≤R＜200','200≤R＜250','250≤R＜300','300≤R＜400','R≥400'],
          'money':['0.75','1.2','1.7','2.25','2.5',],
          'explain':'按照中央标准1∶0.5给予财政补助'
        },
        'mixtureEle':{
          'section':['R≥50'],
          'money':['1.1'],
          'explain':'按照中央标准1∶0.5给予财政补助'
        }
      },
      'hz':{
        'pureEle':{
          'section':['150≤R＜200','200≤R＜250','250≤R＜300','300≤R＜400','R≥400'],
          'money':['0.75','1.2','1.7','2.25','2.5',],
          'explain':'按照中央标准1∶0.5给予财政补助'
        },
        'mixtureEle':{
          'section':['R≥50'],
          'money':['1.1'],
          'explain':'按照中央标准1∶0.5给予财政补助'
        }
      },
      'xm':{
        'pureEle':{
          'section':['150≤R＜200','200≤R＜250','250≤R＜300','300≤R＜400','R≥400'],
          'money':['0.75','1.2','1.7','2.25','2.5',],
          'explain':'按照中央标准1∶0.5给予财政补助'
        },
        'mixtureEle':{
          'section':['R≥50'],
          'money':['1.1'],
          'explain':'按照中央标准1∶0.5给予财政补助'
        }
      },
      'heb':{
        'pureEle':{
          'section':['150≤R＜200','200≤R＜250','250≤R＜300','300≤R＜400','R≥400'],
          'money':['0.75','1.2','1.7','2.25','2.5',],
          'explain':'按照中央标准1∶0.5给予财政补助'
        },
        'mixtureEle':{
          'section':['R≥50'],
          'money':['1.1'],
          'explain':'按照中央标准1∶0.5给予财政补助'
        }
      },
      'lz':{
        'pureEle':{
          'section':['150≤R＜200','200≤R＜250','250≤R＜300','300≤R＜400','R≥400'],
          'money':['0.6','0.96','1.36','1.8','2',],
          'explain':'按照中央标准1∶0.4给予财政补助'
        },
        'mixtureEle':{
          'section':['R≥50'],
          'money':['0.88'],
          'explain':'按照中央标准1∶0.4给予财政补助'
        }
      },
      'gy':{
        'pureEle':{
          'section':['150≤R＜200','200≤R＜250','250≤R＜300','300≤R＜400','R≥400'],
          'money':['0.375','0.6','0.85','1','1.125',]
        },
        'mixtureEle':{
          'section':['R≥50'],
          'money':['0.55']
        }
      },
      'nb':{
        'pureEle':{
          'section':['150≤R＜200','200≤R＜250','250≤R＜300','300≤R＜400','R≥400'],
          'money':['0.75','1.2','1.7','2.25','2.5',],
          'explain':'对符合条件的汽车，按照中央标准1∶0.5给予财政补助'
        },
        'mixtureEle':{
          'section':['R≥50'],
          'money':['1.1'],
          'explain':'对符合条件的汽车，按照中央标准1∶0.5给予财政补助'
        },
        'fuel':{
          'text':'按中央标准1∶0.5给予财政补助。'
        },
        'supplement':'用于租赁的新能源汽车将按照中央标准的25%给予地方配套补贴。同时，除燃料电池汽车外，宁波市还将实施按量退坡的补贴办法，即补助标准根据厂商在当地累计销售单一类型新能源汽车数量退坡。其中，乘用车单一车型销量累计超过2000辆便不享受地方补贴'
      }
    }

    var policy = {
        elements: {
          navTabBtn: $('.genre-title div'),
          navTabCnt: $('.genre-info'),
          boxTabCnt: $('.car-type'),
        },
        init:function(){
            this.bindEvent();
            this.itemCar();
        },
        bindEvent:function(){
            var context = this;
            this.allTab(this.elements.navTabBtn,this.elements.navTabCnt,this.elements.boxTabCnt);
            var app = context.getUrlQueryString('fromApp');
           
            if(app){
                $('.app-hide').addClass('fn-hide');
            }else{
              $('.app-hide').removeClass('fn-hide');
            }
            wx.miniProgram.getEnv(function(res) {
                // alert(res.miniprogram);
                // res.miniprogram;
                $('.app-hide').addClass('fn-hide');
            })
        },
        getUrlQueryString: function(name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            }
            return null;
        },
       

        allTab:function(btn,ctn,xtn){
          var context = this;
          btn.on('click', function() {
              var index = btn.index(this);
              if ($(this).hasClass('current')) {
                  return;
              } else {
                  btn.removeClass('current');
                  btn.eq(index).addClass('current');
                  ctn.addClass('fn-hide');
                  ctn.eq(index).removeClass('fn-hide');
                  xtn.addClass('fn-hide');
                  xtn.eq(index).removeClass('fn-hide');
              }
          });

        },
       
        itemCar:function(){
              var context = this;
            // var arr = city[id]
             $('#area').bind('change',function(){
                var cityLetter = $(this).val();
                $('.section-box').html("");
                if(cityLetter != 0 ){
                  $('.section-qg').addClass('fn-hide');
                  $(".section-box").append(context.pureEleHtml(cityLetter))
                               .append(context.mixtureEleHtml(cityLetter))
                               .append(context.fuelHtml(cityLetter))
                              .append(context.supplementHtml(cityLetter));

                }else{
                    $('.section-qg').removeClass('fn-hide');
                }
             })
        },
        itemFor:function(item){
          var tableItemHtml = '';
          var arrItem = item;
          for(var i=0;i<arrItem.length;i++){
              tableItemHtml += '<p>'+arrItem[i]+'</p>';
          }
          return tableItemHtml
        },
        tableHtml:function(arr){
            this.itemFor(arr.section);
            var sectionItem = this.itemFor(arr.section);
            var moneyItem =this.itemFor(arr.money);
            var tableHtml = '';
            if(arr.sectionAdd){
              var sectionAddItem = this.itemFor(arr.sectionAdd);
              var moneyAddItem =this.itemFor(arr.moneyAdd);
              tableHtml += 
              '<div class="pure-table-wh">'+arr.whexplaintop+'</div>';
            }
            tableHtml +=
            '<div class="pure-table-info">'+
              '<div class="pure-table-info-section">'+
                '<p>区间（公里）</p>'+sectionItem+
              '</div>'+
              '<div class="pure-table-info-section">'+
                '<p>金额（万元）</p>'+moneyItem+
              '</div>'+
            '</div>';
            if(arr.explain){
             tableHtml +='<div class="pure-table-explain">'+arr.explain+'</div>';
            }
            if(arr.whexplainAdd){
              tableHtml += 
               '<div class="pure-table-wh next">'+arr.whexplainAdd+'</div>'+
               '<div class="pure-table-info">'+
                '<div class="pure-table-info-section">'+
                  '<p>区间（公里）</p>'+sectionAddItem+
                '</div>'+
                '<div class="pure-table-info-section">'+
                  '<p>金额（万元）</p>'+moneyAddItem+
                '</div>'+
              '</div>';
            }
            return tableHtml;
        },
        pureEleHtml:function(letter){
          var pureHtml = '';
          if(city[letter].pureEle){
            pureHtml +=
            '<div class="pure wrap" data-tag="pureEle">'+
              '<div class="pure-title">'+
                '<div class="pure-title-car">纯电动车型</div>'+
                '<div class="pure-title-endurance">续航(R)</div>'+
              '</div>'+
             '<div class="pure-table">'+this.tableHtml(city[letter].pureEle)+
             '</div>'+
            '</div>';
          }
          
          return pureHtml;
        },
        mixtureEleHtml:function(letter){
          var mixtureEleHtml = '';
          if(city[letter].mixtureEle){
            mixtureEleHtml +=
          '<div class="pure wrap" data-tag="mixtureEle">'+
            '<div class="pure-title">'+
              '<div class="pure-title-car">插电混动(含增程)车型</div>'+
              '<div class="pure-title-endurance">纯电续航(R)</div>'+
            '</div>'+
           '<div class="pure-table">'+this.tableHtml(city[letter].mixtureEle)+
           '</div>'+
          '</div>';

          }
          
          return mixtureEleHtml;
        },
        fuelHtml:function(letter){
            var fuelHtml = '';
            if(city[letter].fuel){
              fuelHtml += 
            '<div class="pure wrap">'+
              '<div class="pure-title">'+
                '<div class="pure-title-car">燃料电池车型</div>'+
              '</div>'+
              '<div class="supplement-main">'+city[letter].fuel.text+'</div>'+
            '</div>';
            }
            return fuelHtml;
        },
        supplementHtml:function(letter){
            var supplementHtml = '';
            if(city[letter].supplement){
                supplementHtml += 
              '<div class="supplement wrap">'+
                '<div class="pure-title">'+
                  '<div class="pure-title-car">补充说明</div>'+
                '</div>'+
                '<div class="supplement-main">'+city[letter].supplement+'</div>'+
              '</div>';
            }
          
            return supplementHtml;
        },

       
    }
    module.exports = policy;
});