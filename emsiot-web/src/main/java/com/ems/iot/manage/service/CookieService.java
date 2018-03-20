package com.ems.iot.manage.service;

import com.ems.iot.manage.entity.Cookies;

public interface CookieService {

	static int EXPIERD_TIME = 60;

	public String insertCookie(String username);

	public Cookies findEffectiveCookie(String cookie);

	public void deleteCookie(String cookie);
}
