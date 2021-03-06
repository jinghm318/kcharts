/*
combined files : 

gallery/kcharts/1.2/radar/xxyy
gallery/kcharts/1.2/radar/index

*/
;KISSY.add("gallery/kcharts/1.2/radar/xxyy",function(S){
  function XXYY() {
    this.epsilon = 1.0;
    while ((1 + (this.epsilon / 2)) !== 1) {
      this.epsilon /= 2;
    }
    return this;
  };
  XXYY.prototype.ONE_OVER_LOG_10 = 1 / Math.log(10);
  /*
   *
   */
  XXYY.prototype.extended = function(dmin, dmax, m, onlyLoose, Q, w) {
    var bestLmax, bestLmin, bestLstep, bestScore, c, cm, delta, dm, eps, g, j, k, l, length, lmax, lmin, max, maxStart, min, minStart, q, qi, s, score, sm, start, step, thisScore, z, _i, _j, _ref, _ref1;
    if (onlyLoose == null) {
      onlyLoose = false;
    }
    if (Q == null) {
      Q = [1, 5, 2, 2.5, 4, 3];
    }
    if (w == null) {
      w = {
        simplicity: 0.2,
        coverage: 0.25,
        density: 0.5,
        legibility: 0.05
      };
    }
    score = function(simplicity, coverage, density, legibility) {
      return w.simplicity * simplicity + w.coverage * coverage + w.density * density + w.legibility * legibility;
    };
    bestLmin = 0.0;
    bestLmax = 0.0;
    bestLstep = 0.0;
    bestScore = -2.0;
    eps = this.epsilon;
    _ref = (dmin > dmax ? [dmax, dmin] : [dmin, dmax]), min = _ref[0], max = _ref[1];
    if (dmax - dmin < eps) {
      return [min, max, m, -2];
    } else {
      length = Q.length;
      j = -1.0;
      while (j < Number.POSITIVE_INFINITY) {
        for (qi = _i = 0, _ref1 = length - 1; 0 <= _ref1 ? _i <= _ref1 : _i >= _ref1; qi = 0 <= _ref1 ? ++_i : --_i) {
          q = Q[qi];
          sm = this.simplicityMax(qi, length, j);
          if (score(sm, 1, 1, 1) < bestScore) {
            j = Number.POSITIVE_INFINITY;
          } else {
            k = 2.0;
            while (k < Number.POSITIVE_INFINITY) {
              dm = this.densityMax(k, m);
              if (score(sm, 1, dm, 1) < bestScore) {
                k = Number.POSITIVE_INFINITY;
              } else {
                delta = (max - min) / (k + 1) / j / q;
                z = Math.ceil(Math.log(delta) * this.ONE_OVER_LOG_10);
                while (z < Number.POSITIVE_INFINITY) {
                  step = j * q * Math.pow(10, z);
                  cm = this.coverageMax(min, max, step * (k - 1));
                  if (score(sm, cm, dm, 1) < bestScore) {
                    z = Number.POSITIVE_INFINITY;
                  } else {
                    minStart = Math.floor(max / step) * j - (k - 1) * j;
                    maxStart = Math.ceil(min / step) * j;
                    if (minStart > maxStart) {

                    } else {
                      for (start = _j = minStart; minStart <= maxStart ? _j <= maxStart : _j >= maxStart; start = minStart <= maxStart ? ++_j : --_j) {
                        lmin = start * (step / j);
                        lmax = lmin + step * (k - 1);
                        if (!onlyLoose || (lmin <= min && lmax >= max)) {
                          s = this.simplicity(qi, length, j, lmin, lmax, step);
                          c = this.coverage(min, max, lmin, lmax);
                          g = this.density(k, m, min, max, lmin, lmax);
                          l = this.legibility(lmin, lmax, step);
                          thisScore = score(s, c, g, l);
                          if (thisScore > bestScore) {
                            bestScore = thisScore;
                            bestLmin = lmin;
                            bestLmax = lmax;
                            bestLstep = step;
                          }
                        }
                      }
                    }
                    z += 1;
                  }
                }
              }
              k += 1;
            }
          }
        }
        j += 1;
      }
      return [bestLmin, bestLmax, bestLstep, bestScore];
    }
  };
  XXYY.prototype.simplicity = function(i, n, j, lmin, lmax, lstep) {
    var v;
    v = ((lmin % lstep) < this.epsilon || (lstep - (lmin % lstep)) < this.epsilon) && lmin <= 0 && lmax >= 0 ? 1 : 0;
    return 1 - (i / (n - 1)) - j + v;
  };
  XXYY.prototype.simplicityMax = function(i, n, j) {
    return 1 - i / (n - 1) - j + 1;
  };
  XXYY.prototype.coverage = function(dmin, dmax, lmin, lmax) {
    var range;
    range = dmax - dmin;
    return 1 - 0.5 * (Math.pow(dmax - lmax, 2) + Math.pow(dmin - lmin, 2)) / (Math.pow(0.1 * range, 2));
  };
  XXYY.prototype.coverageMax = function(dmin, dmax, span) {
    var half, range;
    range = dmax - dmin;
    if (span > range) {
      half = (span - range) / 2;
      return 1 - 0.5 * (Math.pow(half, 2) + Math.pow(half, 2)) / (Math.pow(0.1 * range, 2));
    } else {
      return 1;
    }
  };
  XXYY.prototype.density = function(k, m, dmin, dmax, lmin, lmax) {
    var r, rt;
    r = (k - 1) / (lmax - lmin);
    rt = (m - 1) / (Math.max(lmax, dmax) - Math.min(dmin, lmin));
    return 2 - Math.max(r / rt, rt / r);
  };
  XXYY.prototype.densityMax = function(k, m) {
    if (k >= m) {
      return 2 - (k - 1) / (m - 1);
    } else {
      return 1;
    }
  };
  XXYY.prototype.legibility = function(lmin, lmax, lstep) {
    return 1.0;
  };
  return XXYY;
});

// -*- coding: utf-8; -*-
;KISSY.add("gallery/kcharts/1.2/radar/index",function(S,Raphael,XY,D,E,Legend){
  var pi = Math.PI
    , unit = pi/180

  var each = S.each,
      map = S.map,
      filter = S.filter,
      merge = S.merge

  // Gets a position on a radar line.
  function lined_on( origin, base, bias){
    return origin + (base - origin) * bias;
  };
  // Gets SVG path string for a group of scores.
  function path_string( center, points, scores){
    var vertex = [];
    for( var i = 0; i < points.length; i++){
      var x = lined_on( center.x, points[i].x, scores[i]);
      var y = lined_on( center.y, points[i].y, scores[i]);
      vertex.push( "" + x + " " + y);
    }
    return "M " + vertex.join("L ") + "z";
  };

  var xy;
  function rullernums(min,max,n){
    xy || (xy = new XY());
    var r = xy.extended(min,max,n);
    var ret = [];
    var from = r[0]
    var to = r[1];
    var step = r[2];
    var rullern = (to - from)/step;
    for(var i=1;i<=rullern;i++){
      ret.push(to);
      to-=step;
    }
    ret = ret.reverse();
    return {rullers:ret,rullern:rullern};
  }
  function polygon(points){
    var s;
    for(var i=0,l=points.length;i<l;i++){
      var point = points[i]
        , x = point.x
        , y = point.y
      if(i){
        s.push("L",x,y);
      }else{
        s = ["M",x,y]
      }
    }
    s.push("Z");
    return s.join(',');
  }

  var global_draw_defaults = {
    text: { fill: '#222', 'max-chars': 10, 'key': true }
  }
  var default_draw_options = {
    points: {'fill':'#333','stroke-width':'0', 'size': 4.5},
    text: {'fill':"#222",'text-anchor':'start'},
    lines: {'stroke-width':'1' }
  };

  function hideORshow(array_of_el,hide_or_show){
    var method;
    if(hide_or_show){
      method = "show";
    }else{
      method = "hide";
    }
    each(array_of_el,function(el){
      el[method]();
    });
  }


  var anim = {
    easing:"linear",
    duration:800
  };

  function Radar(cfg){
    var container = S.get(cfg.renderTo);
    cfg.anim = S.merge(anim,cfg.anim);

    this.set("container",container);
    this.set(cfg);

    this._animationInstance = 0;


    this.dochk(cfg);
    var paper;
    if(container){
      paper = Raphael(container,cfg.width,cfg.height)
    }else{
      throw Error("容器不能为空");
    }
    this.set("paper",paper);
    this.set("config",cfg);
    this.render(cfg)
  }
  S.extend(Radar,S.Base,{
    dochk:function(cfg){
      //设置多边形的边
      var size = cfg.labels.length;
      var w = D.width(this.get("container"));
      var h = D.height(this.get("container"));
      this.set("sides",size)
      //如果没有甚至cx,cy，自动设置
      if(cfg.cx == undefined){
        cfg.cx = w/2;
      }
      if(cfg.cy == undefined){
        cfg.cy = h/2;
      }
      //没有设置max，自动寻找
      var groups = this.get("scoreGroups");
      var nums = [] ;
      if(groups[0] && groups[0].scores){
        each(groups,function(item){
          nums = nums.concat(item.scores);
        });
      }
      // 用于自动计算刻度
      var max = Math.max.apply(Math,nums);
      var min = Math.min.apply(Math,nums);
      // if(!cfg.min || cfg.min > min){
      //   cfg.min = min;
      // }

      cfg.min = 0;

      if(!cfg.max || cfg.max < max){
        cfg.max = max;
      }

      //没有r，自动设定一个
      if(cfg.r == undefined){
        var minr = Math.min.apply(Math,[w,h]);
        cfg.r = minr/2 - 30;//预留给label的
        if(cfg.r < 0){
          cfg.r = minr/2;
        }
      }
    },
    drawPolygon:function(points){
      var paper = this.get("paper")
      var pathstring = polygon(points);
      return paper.path(pathstring);
    },
    //多边形框架
    drawFrame:function(points){
      var path = this.drawPolygon(points).attr({"stroke":"#777"});
      this.set("framepath",path);
    },
    getOption:function(){
      var cfg = this.get("config")
        , global_draw_defaults = {
        text: { fill: '#222', 'max-chars': 10, 'key': true }
        }
        , default_draw_options = cfg.options

      var global_draw_options = merge(global_draw_defaults, cfg.options);
      return global_draw_options
    },
    getGroupOption:function(option){
      var default_draw_options = {
        points: {'fill':'#333','stroke-width':'0', 'size': 4.5},
        text: {'fill':"#222",'text-anchor':'start'},
        lines: {'stroke-width':'1' }
      };
      return S.merge(default_draw_options,option);
    },
    //绘制多边形对比曲线
    drawGroup:function(scores,points,opts){
      var config = this.get("config")
        , x,y
        , cx = config.cx
        , cy = config.cy
        , paper = this.get("paper")

      var lines = this.get("lines") || []
        , line
        , circle
        , circleset = []
        , circles = this.get("pts") || []

      var pa = []
      for( var i = 0; i < points.length; i++){
        x = lined_on( cx, points[i].x, scores[i]);
        y = lined_on( cy, points[i].y, scores[i]);
        pa.push({x:x,y:y});
      }

      line = this.drawPolygon(pa);
      opts && opts.lines && line.attr(opts.lines);
      for (var j=0; j<scores.length; j++) {
        x = lined_on( cx, points[j].x, scores[j]);
        y = lined_on( cy, points[j].y, scores[j]);

        circle = paper.circle(x,y,opts['points']['size']).attr(opts['points']);
        circleset.push(circle);
      };
      circles.push(circleset);
      lines.push(line);
      if(!this.get("lines")){
        this.set("lines",lines);
        this.set("pts",circles);
      }
    },
    //获取多边形的顶点
    getPoints:function(){
      var sides = this.get("sides")
        , config = this.get("config")
        , start = -90
        , radius = config.r
        , x , y
        , cx = config.cx
        , cy = config.cy

      var points = []
        , u = 360.0 / sides
      for (var i=0; i<sides; i++) {
        var rad = (start / 360.0) * (2 * Math.PI);
        x = cx + radius * Math.cos(rad);
        y = cy + radius * Math.sin(rad);
        points.push({x:x,y:y});
        start += u;
      }
      return points;
    },
    //获取radar的主体
    getBBox:function(){
      var r = this.get("r"),
          w = r*2,
          h = r*2,
          cx = this.get("cx"),
          cy = this.get("cy");

      return {
        width:w,
        height:h,
        left:cx - w/2,
        top:cy - h/2
      }
    },
    // legend
    drawLegend:function(lineprops){
      var con = this.get("container")
        , bbox = this.getBBox()
        , legend = this.get("legend") || {}

      var globalConfig = merge({
        interval:20,//legend之间的间隔
        iconright:5,//icon后面的空白
        showicon:true //默认为true. 是否显示legend前面的小icon——可能用户有自定义的需求
      },legend.globalConfig)

      delete legend.globalConfig;

      var $legend = new Legend(merge({
        container:con,
        paper:this.get("paper"),
        bbox:bbox,
        align:legend.align || "bc",
        offset:legend.offset || [0,20],
        globalConfig:globalConfig,
        config:lineprops
      },legend));

      $legend.on("click",function(e){
        if(this.isRunning()){
          return;
        }
        var i = e.index
          , $text = e.text
          , $icon = e.icon
          , el = e.el
        if (el.hide != 1) {
          this.hideLine(i);
          el.hide = 1;
          el.disable();
        } else {
          this.showLine(i);
          el.hide = 0;
          el.enable();
        }
      },this);

      this.set("legend",$legend);
      // old legend
      // return;
      // var paper = this.get("paper")
      //   , config = this.get("config")
      //   , cx = config.cx
      //   , cy = config.cy
      //   , r = config.r
      //   , y0 = cy + r

      // var x1 = cx - 50
      //   , y1 = y0 + 30 + 20*i;
      // var x2 = cx
      //   , y2 = y1;

      // var line = paper.path("M " + x1 + " " + y1 + " L " + x2 + " " + y2).attr(opts['lines']);
      // var point = paper.circle(x1,y1,opts['points']['size']).attr(opts['points']);
      // var text = paper.text( x2+10, y2, title).attr(opts['text']);
    },
    hideLine:function(i){
      var lines = this.get("lines")
        , pts = this.get("pts");
      lines[i] && hideORshow([lines[i]]);
      pts[i] && hideORshow(pts[i]);
    },
    showLine:function(i){
      var lines = this.get("lines")
        , pts = this.get("pts");
      lines[i] && hideORshow([lines[i]],true);
      pts[i] && hideORshow(pts[i],true);
    },
    drawLabels:function(edge_points,opts){
      var points = edge_points
      var that = this;

      var paper = this.get("paper")
        , config = this.get("config")
        , cx = config.cx
        , cy = config.cy
        , r = config.r
        , y0 = cy + r
        , labels = config.labels
      var x,y

      for (var i = 0; i < points.length; i++) {
        x = lined_on( cx, points[i].x, 1.1);
        y = lined_on( cy, points[i].y, 1.1);
        var anchor = "middle";
        if (x>cx) anchor = "start";
        if (x<cx) anchor = "end";

        var label = labels[i];
        if (label.length > opts['text']['max-chars']) label = label.replace(" ", "\n");
        var text = paper.text( x, y, label).attr(S.merge(opts['text'],{'text-anchor': anchor ,"cursor":"pointer"}));
	    (function(text,i,point){
           text.click(function(){
             that.fire('labelclick',{index:i,x:point.x,y:point.y});
           })
           .mouseover(function(){
             that.fire('labelmouseover',{index:i,x:point.x,y:point.y});
           })
           .mouseout(function(){
             that.fire('labelmouseout',{index:i,x:point.x,y:point.y});
           })
        })(text,i,points[i]);
      }
    },
    //中心发散的刻度尺
    drawMeasureAndRuler:function(points){
      var paper = this.get("paper")
        , config = this.get("config")
        , cx = config.cx
        , cy = config.cy
        , x,y
        , x1,y1
        , x2,y2
      // Draws measures of the chart
      var measures=[], rulers=[];

      /*
      for (var i = 0; i < points.length; i++) {
        x = points[i].x, y = points[i].y;
        measures.push( paper.path("M " + cx + " " + cy + " L " + x + " " + y).attr("stroke", "#777") );
        var r_len = 0.025;

        for (var j = 1; j < 5; j++) {
          x1 = lined_on( cx, points[i].x, j * 0.20 - r_len);
          y1 = lined_on( cy, points[i].y, j * 0.20 - r_len);
          x2 = lined_on( cx, points[i].x, j * 0.20 + r_len);
          y2 = lined_on( cy, points[i].y, j * 0.20 + r_len);
          var cl = paper.path("M " + x1 + " " + y1 + " L " + x2 + " " + y2).attr({"stroke":"#777"});
          cl.rotate(90);

          var _r = "r"+(i*60)+","+cx+','+cy;
          // console.log(_r);

          paper.text(x1,y1,j)
          .translate(5,0)
          .rotate(i*60)
          // .transform(_r);

          rulers.push(cl);
        }
      }
    */

      var deg2rad = Math.PI/180;
      var pointlen = points.length;
      var degunit = 360/pointlen;

      var filterfn = false;
          if(config.labelfn){
            if(S.isFunction(config.labelfn)){
              filterfn = config.labelfn;
            }
          }

      var rullern = (config.ruller && config.ruller.n) || 5;
      var result = rullernums(config.min,config.max,rullern);
      var rullers = result.rullers;

      rullern = result.rullern;

      var ratio = 1/rullern;

      for(var i=0;i<pointlen;i++){
        x = points[i].x, y = points[i].y;
        measures.push( paper.path("M " + cx + " " + cy + " L " + x + " " + y).attr("stroke", "#777") );
        // var pts = axis([cx,cy],[points[i].x,points[i].y],4);
        // 0  180 - 0
        // 1  180 - 60
        // 2  180 - 120
        // 3  180 - 180
        // 4
        // 5
        var deg = 180 - i*degunit;
        // var unit = [4*Math.sin(deg*deg2rad),-4*Math.cos(deg*deg2rad)];
        var ix = Math.cos(deg*deg2rad);
        var iy = Math.sin(deg*deg2rad);

        for (var j = 1; j < rullern; j++) {
          var x0 = lined_on( cx, points[i].x, j * ratio);
          var y0 = lined_on( cy, points[i].y, j * ratio);

          x1 = x0+ix*3; y1=y0-iy*3;
          x2 = x0-ix*3; y2=y0+iy*3;
          var x3,y3;
          x3 = x0-ix*5; y3=y0+iy*5;
          // paper.circle(x0,y0,2).attr({"fill":'red'});
          // paper.circle(x1,y1,2);
          // paper.circle(x2,y2,2).attr({"fill":'green'});
          paper.path(["M",x2,y2,"L",x1,y1,"Z"]);
          var rotate_deg = i*degunit;
          if(rotate_deg>=270){
            rotate_deg +=90;
          }else if(rotate_deg>=90){
            rotate_deg +=180;
          }
          if(filterfn){
            if(filterfn(i)){
              var text;
              if(config.ruller && config.ruller.template){
                text = config.ruller.template(i,j,rullers[j-1]);
              }
              paper.text(x3,y3,text).attr({"text-anchor":"start"}).rotate(rotate_deg);
            }
          }
        }
      }
    },
    getScoreFromGroup:function(group){
      var scores = []
        , config = this.get("config")
        , max_score = config.max - config.min
        , labels = config.labels
      if(group.scores) {
        for (var j=0; j<group.scores.length; j++)
          scores.push(group.scores[j] / max_score);
      }
      //  移除对下面这种配置方式的支持
      /*
      scoreGroups:[
        { title: "Real Madrid C.F.",
          offense: 8,
          defense: 9,
          technique: 7,
          strategy: 9,
          physicality: 7,
          mentality: 6,
          draw_options: {
            lines: {'stroke-width':'2', 'stroke':'#39b549','stroke-dasharray':'- '},
            points: {'fill':'#39b549','stroke-width':'0',size:5}
          }
        }]
       */
      else {
        for(var j=0; j<labels.length; j++) {
          var value = group[labels[j]] || group[labels[j].toLowerCase().replace(" ","_")];
          scores.push( value / max_score);
        }
      }
      return scores;
    },
    isRunning:function(){
      return this._animationInstance > 0;
    },
    render:function(cfg){
      cfg || (cfg = this.get("config"));
      var paper = this.get("paper")
        , cx = this.get("cx")
        , cy= this.get("cy")
        , radius = this.get("r")
        , labels = this.get("labels")
        , max_score = this.get("max")
        , score_groups = this.get("scoreGroups")
        , user_draw_options = this.get("options")
        , anim = this.get("anim")
        , that = this

      var global_draw_options = S.merge(global_draw_defaults, user_draw_options);
      var points = this.getPoints();

      this.drawMeasureAndRuler(points);
      this.drawFrame(points);

      //绘制过了
      if(this.get("lines")){
        var pathstring = "";
        var pss = [];
        var x,y;
        var newPtss = [];
        for (var i=0; i<score_groups.length; i++){
          var scores = this.getScoreFromGroup(score_groups[i]);
          var newPts = [];
          for(var j=0;j<scores.length;j++){
            x = lined_on( cx, points[j].x, scores[j]);
            y = lined_on( cy, points[j].y, scores[j]);
            newPts.push({x:x,y:y});
          }
          newPtss.push(newPts);
          var ps = polygon(newPts);
          pss.push(ps);
        }
        var $lines = this.get("lines");
        var pts = this.get("pts");
        each(pss,function(ps,key){
          var pt = pts[key];
          var newPt = newPtss[key];
          each(pt,function(p){
            p.hide();
          });
          that._animationInstance+=1;
          $lines[key].animate({path:pss[key]},anim.duration,anim.easing,function(){
            each(pt,function(p,i){
              p.attr({cx:newPt[i].x,cy:newPt[i].y});
              p.show();
            });
            that._animationInstance-=1;
          });
        });
      }else{
        var legendprops = [];
        // group and legend
        for (var i=0; i<score_groups.length; i++){
          var scores = this.getScoreFromGroup(score_groups[i]);
          var title = score_groups[i].title;

          var draw_options = merge(default_draw_options, score_groups[i]['draw_options'] );
          var opts = this.getGroupOption(score_groups[i]['draw_options'])

          this.drawGroup(scores,points,opts);
          legendprops.push({text:title,DEFAULT:opts['lines']["stroke"]});
        }

        this.drawLabels(points,global_draw_options);
        this.drawLegend(legendprops);
      }
    }
  });
  return Radar;
},{
  requires:[
    "gallery/kcharts/1.2/raphael/index",
    './xxyy',
    "dom","event",
    'gallery/kcharts/1.2/legend/index'
  ]
});
/**
 * refs:
 * https://github.com/jsoma/raphael-radar.git
 * TODO:
 * 配置不要放在config对象中
 * */
