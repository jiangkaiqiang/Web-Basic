package com.wls.manage.crawler.iyiou.wenchuang;

import java.text.ParseException;
import java.util.Iterator;
import java.util.List;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;

import com.wls.manage.dao.InformationMapper;
import com.wls.manage.dto.NewInfomationDto;
/**
 * Created by haolidong on 2016/11/12.
 */
public class ListCrawler_iyiou_wenchuang {
	@Autowired
	private InformationMapper informationMapper;
    private static Logger logger = Logger.getLogger(ListCrawler_iyiou_wenchuang.class.getName());
    public ListCrawlJob_iyiou_wenchuang lj;
    public List<NewInfomationDto> parse() throws ParseException {
    	 logger.info("Start Crawl Pages on 艾瑞网");   
         ListCrawlJob_iyiou_wenchuang crawler =new ListCrawlJob_iyiou_wenchuang();
         crawler.getUrlList("http://www.iyiou.com/i/wenchuang/page/2.html");
         for(NewInfomationDto ni:crawler.an){
             new PageCrawJob_iyiou_wenchuang().pageCraw(ni);
         }
         return crawler.an;
	}
    
    public static void main(String[] args) throws ParseException {
    	List<NewInfomationDto> an =new ListCrawler_iyiou_wenchuang().parse();
    	for(NewInfomationDto ni:an){
    		System.out.println(ni.getSource());
    	}
	}
}