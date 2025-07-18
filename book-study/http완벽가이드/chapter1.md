# 1. HTTP 개관

## 1.1 HTTP: 인터넷의 멀티미디어 배달부

- 애플리케이션 계층 프로토콜.
- 신뢰성 있는 데이터 전송 프로토콜을 사용하기 때문에 손상되지 않음.

## 1.2 웹 클라이언트와 서버

- 웹 서버라고 불리우는 HTTP 서버 아래와 같은 순서로 데이터 전송 과정이 이루어짐.
  - 클라이언트 → 요청 → 서버 → 클라이언트에서 요청된 응답 반환.

## 1.3 리소스

- 어떠한 종류의 콘텐츠 소스도 리소스가 될 수 있으벼 웹 서버는 웹 리소스를 관리하고 제공.

### 1.3.1 미디어 타입

MIME(Multipurpose Internet Mail Extensions, 다목적 인터넷 메일 확장)

- 웹 서버는 모든 HTTP 객체 데이터에 MIME 타입을 붙이며 웹 브라우저는 서버로부터 객체를 돌려받을 때 다룰 수 있는 객체인지 MIME 타입을 통해 확인한다.
  - HTML → text/html
  - plain ASCII → text/plain
  - JPEG이미지 → image/jpeg
  - GIF 이미지 → image/jif

### 1.3.2 URI

- URI는 정보 리소스를 고유하게 식별하기 위해 사용된다.

### 1.3.3 URL

- 특성 서버의 한 리소스에 대한 구체적인 위치를 알려줌
  - http:// → 스킴 이라고 하며 리소스 접근을 위해 사용되는 프로토콜을 칭함

### 1.3.4 URN

- 콘텐츠를 이루는 한 리소스에 대해, 그 리소스의 위치에 영향 받지 않는 이름 역할. 리소스를 여기저기로 옮겨도 문제 없이 동작함

## 1.4 트랜잭션

요청 명령(클라이언트 → 서버) 와 응답 결과(서버 → 클라이언트)로 구성됨.

### 1.4.1 메서드

| HTTP 메서드 | 설명                                                                |
| ----------- | ------------------------------------------------------------------- |
| GET         | 서버에서 클라이언트로 지정한 리소스를 보내라                        |
| PUT         | 클라이언트에서 서버로 보낸 데이터를 지정한 이름의 리소스로 저장해라 |
| DELETE      | 지정한 리소스 삭제해라                                              |
| POST        | 클라이언트 데이터를 서버 게이트웨이 어플리케이션으로 보내라         |
| HEAD        | 지정한 리소스에 대한 응답에서 HTTP 헤더 부분만 보내라               |

### 1.4.2 상태코드

- HTTP 응답 메세지는 상태코드와 함께 반환됨. (200, 302, 404 등..)

### 1.4.3 웹 페이지는 여러 객체로 이루어질 수 있다

- 웹페이지는 첨부된 리소스들에 대해 각각 별개의 HTTP 트랜잭션을 필요로함

## 1.5 메세지

HTTP 요청, 응답 메세지의 형식은 비슷하며 시작줄, 헤더, 본문 으로 이루어져있다.

## 1.6 TCP 커넥션

### 1.6.1 TCP/IP

- 오류없는 데이터 전송
- 순서에 맞는 전달(보낸 순서대로 도착)
- 조각 나지 않는 데이터 스트림(언제든 어떤 크키로든 OK)

### 1.6.2 접속, IP주소, 포트번호

웹 브라우저의 연결 절차는 아래와 같다.

1. 웹 브라우저는 서버의 URL에서 호스트 명을 추출한다.
2. 서버의 호스트 명을 IP로 변환한다.
3. URL에서 포트번호를 추출한다.
4. 웹 서버와 TCP 커넥션을 맺는다.
5. 서버에 HTTP 요청을 보낸다.
6. 서버는 웹 브라우저에 HTTP 응답을 돌려준다.
7. 커넥션이 닫히면, 웹 브라우저는 제문서를 보여준다.

### 1.6.3 텔넷을 이용한 예제

```bash
$ telnet www.joes-hardware.com 80
... 커넥션 완료
...
GET /tools.html HTTP/1.1 // 기본요청 명쳥
Host: www.joes-hardware.com
```

호스트 명을 찾아 80포트로 대기중인 [www.joes-hardware.com](http://www.joes-hardware.com) 웹서버에 연결한다.

## 1.7 프로토콜 버전

- HTTP/0.9
  - 오직 GET메서드만 지원, MIME타입, HTTP헤더, 버전 번호 지원하지 않음.
  - 간단한 HTML객체만 받아오기 위해 만들어짐
- HTTP/1.0
  - 버전번호, HTTP헤더, 추가 메서드, 머맅미디어 객체 처리 추가
- HTTP/1.0
  - 오래 지속되는 “keep-alive” 커넥션, 가상호스팅 지원, 프락시 연결 지원 등 사실상 표준으로 추가됨
- HTTP1.1
  - 현재의 http 버전.
  - http설계 결함 교정, 성능 최적화 등 기능 보완
- HTTP/2.0
  - HTTP/1.1 성능개선

## 1.8 웹의 구성 요소

- 프락시: 클라이언트와 서버 사이에 위치한 HTTP 중개자
- 캐시: 많이 찾는 웹페이지를 클라이언트 가까이에 보관하는 HTTP창고
- 게이트웨이: 다른 어플리케이션과 연결된 특별한 웹 서버sss
- 터널: 단순히 HTTP 통신을 전달만 하는 특별한 프락시
- 에이전트: 자동화된 HTTP 요청을 만드는 준지능적 웹클라이언트
