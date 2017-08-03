package com.shfb.rfid.manage.controller;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.shfb.rfid.manage.dao.RecordMapper;
import com.shfb.rfid.manage.dto.BaseDto;
import com.shfb.rfid.manage.dto.ResultDto;
import com.shfb.rfid.manage.dto.UploadFileEntity;
import com.shfb.rfid.manage.entity.Record;
import com.shfb.rfid.manage.service.FtpService;
@Controller
@RequestMapping(value = "/record")
public class RecordController extends BaseController {
	@Autowired
	private RecordMapper recordDao;
	@Autowired
	private FtpService ftpservice;
	
	@RequestMapping(value = "/findRecordList", method = RequestMethod.POST)
	@ResponseBody
	public Object findProjectList(@RequestParam(value="pageNum",required=false) Integer pageNum,
			@RequestParam(value="pageSize") Integer pageSize, 
			@RequestParam(value="startTime", required=false) String startTime,
			@RequestParam(value="endTime", required=false) String endTime,
			@RequestParam(value="keyword", required=false) String keyword) throws UnsupportedEncodingException {
		pageNum = pageNum == null? 1:pageNum;
		pageSize = pageSize==null? 12:pageSize;
		PageHelper.startPage(pageNum, pageSize);
		if(keyword.equals("undefined"))
			keyword = null;
		else{
		keyword = URLDecoder.decode(keyword, "UTF-8");
		}
		Page<Record> records = recordDao.findAllRecords(keyword,startTime,endTime);
		return new PageInfo<Record>(records);
		
	}
	@RequestMapping(value = "/addRecordEntry", method = RequestMethod.GET)
	@ResponseBody
	public Object addRecordEntry(Record record,@RequestParam(value = "files", required = false) MultipartFile[] files) throws UnsupportedEncodingException {
		/**
		 * 保存上传的图片
		 */
		boolean res=false;
		if (null != files && files.length>0) {		
			List<UploadFileEntity> fileEntities = new ArrayList<UploadFileEntity>();				
			for (int i = 0; i < files.length; i++) {
				//获取文件的原始名字
				String fileName = files[i].getOriginalFilename();
				fileEntities.add(new UploadFileEntity(fileName, files[i], "uploadPic"));					
				record.setEntry_pic(FtpService.FILE_Url+"uploadPic/"+fileName);
			}
			//保存文件
			res = ftpservice.uploadFileList(fileEntities);	
			recordDao.insert(record);
			}
			if(res == true ) 
				return new ResultDto(1,"添加成功");
			else {
				return new ResultDto(2,"添加失败");
			}
	}
	
	@RequestMapping(value = "/addRecordLeave", method = RequestMethod.GET)
	@ResponseBody
	public Object addRecordLeave(Record record,@RequestParam(value = "files", required = false) MultipartFile[] files) throws UnsupportedEncodingException {
		/**
		 * 保存上传的图片
		 */
		boolean res=false;
		if (null != files && files.length>0) {		
			List<UploadFileEntity> fileEntities = new ArrayList<UploadFileEntity>();				
			for (int i = 0; i < files.length; i++) {
				//获取文件的原始名字
				String fileName = files[i].getOriginalFilename();
				fileEntities.add(new UploadFileEntity(fileName, files[i], "uploadPic"));					
				record.setLeave_pic(FtpService.FILE_Url+"uploadPic/"+fileName);
			}
			//保存文件
			res = ftpservice.uploadFileList(fileEntities);	
			recordDao.insert(record);
			}
			if(res == true ) 
				return new ResultDto(1,"添加成功");
			else {
				return new ResultDto(2,"添加失败");
			}
	}
	
	@RequestMapping(value = "/updateRecord")
	@ResponseBody
	public Object updateRecord(Record record){
		recordDao.updateByPrimaryKey(record);
		return new BaseDto(0);
	}
	
	
	@RequestMapping(value = "/findRecordByID")
	@ResponseBody
	public Object findRecordByID(Integer recordID) {
		Record record = recordDao.selectByPrimaryKey(recordID);
		return record;
	}
	
	@RequestMapping(value = "/deleteRecordByID")
	@ResponseBody
	public Object deleteRecordByID(Integer recordID) {
		 recordDao.deleteByPrimaryKey(recordID);
		 return new BaseDto(0);
	}
	
	@RequestMapping(value = "/deleteRecordByIDs")
	@ResponseBody
	public Object deleteRecordByIDs(Integer[] recordIDs) {
		for(Integer recordID:recordIDs){
			recordDao.deleteByPrimaryKey(recordID);
		}
		return new BaseDto(0);
	}

}
