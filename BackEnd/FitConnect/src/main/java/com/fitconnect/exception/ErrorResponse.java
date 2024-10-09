package com.fitconnect.exception;

import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ErrorResponse {
	private int code;
	private String message;
	
	@JsonProperty("isSuccess")
    private boolean isSuccess = false;
}