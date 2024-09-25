import axios from "axios";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import styles from '../css/SignUp.module.css';
import classNames from 'classnames/bind';

// cx 함수 만들기      SignUp.js는 안쓰고 있음
const cx = classNames.bind(styles);

// Validation 정규표현식
const reg_userName = /^[a-zA-Z].{4,9}$/;
const reg_password = /[\W]/;
const reg_email = /@/;

function SignUP() {
    const [step, setStep] = useState(1);

    const handleNext = () => {
        setStep(step + 1);
    };

    // 폼 상태 관리
    const [formData, setFormData] = useState({
        userName: "",
        password: "",
        password2: "",
        name: "",
        email: "",
        role: "",
        provider: 'normal'
    });

    const [isValid, setValid] = useState({
        userName: false,
        password: false,
        name: false,
        email: false,
        role: false
    });

    const [isDirty, setDirty] = useState({
        userName: false,
        password: false,
        name: false,
        email: false,
        role: false
    });

    // 입력 변화 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (!isDirty[name]) {
            setDirty({
                ...isDirty,
                [name]: true
            });
        }

        setFormData({
            ...formData,
            [name]: value
        });

        validate(name, value);
    };

    // 유효성 검사 함수
    const validate = (name, value) => {
        if (name === "userName") {
            axios.get(`/user/check_username/${value}`)
                .then(res => {
                    setValid({
                        ...isValid,
                        [name]: reg_userName.test(value) && res.data.canUse
                    });
                })
                .catch(error => console.log(error));
        } else if (name === "password") {
            const isEqual = value === formData.password2;
            setValid({
                ...isValid,
                password: reg_password.test(value) && isEqual
            });
        } else if (name === "password2") {
            const isEqual = value === formData.password;
            setValid({
                ...isValid,
                password: reg_password.test(formData.password) && isEqual
            });
        } else if (name === "email") {
            setValid({
                ...isValid,
                [name]: reg_email.test(value)
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("/user", formData)
            .then(res => console.log(res.data))
            .catch(error => console.log(error));
    };

    return (
        <div className={cx('centerContainer')}>
            <div className={cx('signupForm')}>
                <h1 className={cx('textCenter')}>회원 가입 양식</h1>
                {step === 1 && (
                    <Form onSubmit={handleSubmit} noValidate>
                        <Form.Group controlId="id" className="mb-3">
                            <Form.Label>아이디</Form.Label>
                            <Form.Control
                                isValid={isValid.userName}
                                isInvalid={!isValid.userName && isDirty.userName}
                                onChange={handleChange}
                                type="text"
                                name="userName"
                                placeholder="아이디 입력..."
                                className={cx('formControl')}
                            />
                            <div className="form-text">영문자로 시작하고 5~10 글자 이내로 작성하세요</div>
                            <Form.Control.Feedback type="invalid" className={cx('invalid-feedback')}>
                                사용할 수 없는 아이디입니다
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="password" className="mb-3">
                            <Form.Label>비밀번호</Form.Label>
                            <Form.Control
                                isValid={isValid.password}
                                isInvalid={!isValid.password && isDirty.password}
                                onChange={handleChange}
                                type="password"
                                name="password"
                                placeholder="비밀번호 입력..."
                                className={cx('formControl')}
                            />
                            <div className="form-text">특수문자를 1개 이상 포함하세요</div>
                            <Form.Control.Feedback type="invalid" className={cx('invalid-feedback')}>
                                비밀번호를 확인하세요!
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="password2" className="mb-3">
                            <Form.Label>비밀번호 확인</Form.Label>
                            <Form.Control
                                onChange={handleChange}
                                type="password"
                                name="password2"
                                placeholder="비밀번호 입력..."
                                className={cx('formControl')}
                            />
                        </Form.Group>
                        <Button
                            variant='primary'
                            disabled={!isValid.userName || !isValid.password || !formData.password2}
                            onClick={handleNext}
                            className={cx('btnPrimary')}
                        >
                            다음
                        </Button>
                        <div className={cx('textCenter')}>또는</div>
                        <Button
                            variant="outline-dark"
                            disabled={!isValid.userName || !isValid.password}
                            as={Link}
                            to="http://localhost:8888/oauth2/authorization/google"
                            className={cx('btnOutlineDark')}
                        >
                            Google Register
                        </Button>
                    </Form>
                )}

                {step === 2 && (
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="name" className="mb-3">
                            <Form.Label>이름</Form.Label>
                            <Form.Control
                                isValid={isValid.name}
                                isInvalid={!isValid.name && isDirty.name}
                                onChange={handleChange}
                                type="text"
                                name="name"
                                placeholder="이름 입력..."
                                className={cx('formControl')}
                            />
                            <Form.Control.Feedback type="invalid" className={cx('invalid-feedback')}>
                                이름 형식에 맞게 입력해 주세요
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="email" className="mb-3">
                            <Form.Label>이메일</Form.Label>
                            <Form.Control
                                isValid={isValid.email}
                                isInvalid={!isValid.email && isDirty.email}
                                onChange={handleChange}
                                type="email"
                                name="email"
                                placeholder="이메일 입력..."
                                className={cx('formControl')}
                            />
                            <Form.Control.Feedback type="invalid" className={cx('invalid-feedback')}>
                                이메일 형식에 맞게 입력해 주세요
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="role" className="mb-3">
                            <Form.Label>사용자 구분</Form.Label>
                            <Form.Select
                                aria-label="Default select example"
                                onChange={handleChange}
                                name="role"
                                className={cx('formControl')}
                            >
                                <option value="">사용자 선택</option>
                                <option value="member">회원용</option>
                                <option value="trainer">트레이너용</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid" className={cx('invalid-feedback')}>
                                사용자 선택을 해주세요
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Button
                            type="submit"
                            disabled={!isValid.email}
                            variant="primary"
                            className={cx('btnPrimary')}
                        >
                            가입
                        </Button>
                    </Form>
                )}
            </div>
        </div>
    );
}

export default SignUP;
