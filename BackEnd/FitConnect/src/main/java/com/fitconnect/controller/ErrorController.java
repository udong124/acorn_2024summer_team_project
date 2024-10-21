package com.fitconnect.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ErrorController implements org.springframework.boot.web.servlet.error.ErrorController{
	
	@GetMapping("/error")
    public String handleError() {
        // index.html로 리다이렉트
        return "forward:/index.html";
    }
}
