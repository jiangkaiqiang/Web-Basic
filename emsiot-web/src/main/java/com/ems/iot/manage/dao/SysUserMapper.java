package com.ems.iot.manage.dao;

import java.util.List;

import com.ems.iot.manage.entity.SysUser;
import com.github.pagehelper.Page;

import org.apache.ibatis.annotations.Param;

/**
 * @author Barry
 * @date 2018年3月20日下午3:36:10  
 * @version 1.0
 * Copyright: Copyright (c) EMSIOT 2018
 */
public interface SysUserMapper {
	int deleteByPrimaryKey(@Param("user_id") int user_id);
	
	int deleteByProId(@Param("pro_id") Integer pro_id);
	
	SysUser findUser(@Param("user_name") String username, @Param("password") String password);

	SysUser findUserByName(@Param("user_name") String user_name);
	
	SysUser findUserById(@Param("user_id") int user_id);
	
	int insert(SysUser record);
	
	void updateUser(SysUser userEntity);
		
	Page<SysUser> findAllUser(@Param("status")Integer status, @Param("keyword")String keyword,@Param("startTime")String startTime, @Param("endTime")String endTime,@Param("userProjectID")Integer userProjectID);
	
	List<SysUser> findUsersByRoleID(@Param("userRoleID")Integer userRoleID);
}
