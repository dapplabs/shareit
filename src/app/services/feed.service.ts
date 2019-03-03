import { Injectable } from '@angular/core';
import { HttpClient } from '../../../node_modules/@angular/common/http';
import { Observable } from '../../../node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  constructor(
  ) {
  }

  getNyaaContent(): any {
    var self = this;
    var nyaa = "https://nyaa.si/?page=rss";
    var proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    return fetch(proxyUrl + nyaa)
      .then(response => response.text()).then(str => {
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(str,"text/xml");
        
        var jsonObject = self.xmlToJson(xmlDoc) as any;
        var mappedObject = jsonObject.rss.channel.item.map(function(item){
          var res = {
            title: item['title']['#text'],
            category: item['nyaa:category']['#text'],
            downloads: item['nyaa:downloads']['#text'],
            size: item['nyaa:size']['#text'],
            link: item['link']['#text'],
            date: new Date(item['pubDate']['#text']).toISOString().replace(/([^T]+)T([^\.]+).*/g, '$1 $2')
          };
          return res;
        });
        return mappedObject;
      });
  }

  xmlToJson(xml) {
    var self = this;
    // Create the return object
    var obj = {};

    if (xml.nodeType == 1) { // element
      // do attributes
      if (xml.attributes.length > 0) {
        obj["@attributes"] = {};
        for (var j = 0; j < xml.attributes.length; j++) {
          var attribute = xml.attributes.item(j);
          obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
        }
      }
    } else if (xml.nodeType == 3) { // text
      obj = xml.nodeValue;
    }

    // do children
    if (xml.hasChildNodes()) {
      for (var i = 0; i < xml.childNodes.length; i++) {
        var item = xml.childNodes.item(i);
        var nodeName = item.nodeName;
        if (typeof (obj[nodeName]) == "undefined") {
          obj[nodeName] = self.xmlToJson(item);
        } else {
          if (typeof (obj[nodeName].push) == "undefined") {
            var old = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(self.xmlToJson(item));
        }
      }
    }
    return obj;
  };
}
