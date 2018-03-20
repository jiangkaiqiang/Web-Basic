package com.ems.iot.manage.entity;

/**
 * @author Barry
 * @date 2018年3月20日下午3:37:52  
 * @version 1.0
 * Copyright: Copyright (c) EMSIOT 2018
 */
public class Menu {
    private Integer menu_id;

    private String menu_name;

    private String menu_url;

    public Integer getMenu_id() {
        return menu_id;
    }

    public void setMenu_id(Integer menu_id) {
        this.menu_id = menu_id;
    }

    public String getMenu_name() {
        return menu_name;
    }

    public void setMenu_name(String menu_name) {
        this.menu_name = menu_name == null ? null : menu_name.trim();
    }

    public String getMenu_url() {
        return menu_url;
    }

    public void setMenu_url(String menu_url) {
        this.menu_url = menu_url == null ? null : menu_url.trim();
    }
}