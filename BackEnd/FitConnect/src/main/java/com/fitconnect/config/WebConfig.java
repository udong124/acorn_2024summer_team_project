package com.fitconnect.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
	
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/");
    }
    
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // 루트 경로와 모든 서브 경로를 index.html로 포워딩
    	registry.addViewController("/{spring:[a-zA-Z0-9-_]+}")
        .setViewName("forward:/index.html");

		registry.addViewController("/{spring:[a-zA-Z0-9-_]+}/**")
		        .setViewName("forward:/index.html");
		
		registry.addViewController("/{spring:[a-zA-Z0-9-_]+}/**")
		        .setViewName("forward:/index.html");


    }
}