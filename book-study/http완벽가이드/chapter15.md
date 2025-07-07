# 15. 엔터티와 인코딩

HTTP는 매일 수십억 개의 미디어 객체를 실어 나른다. 또한 아래와같은 것들을 **보장**한다

- **객체는 올바르게 식별되므로 브라우저나 다른 클라이언트는 콘텐츠를 바르게 처리할 수 있다.**
  - `Content-Type` 미디어 포맷과 `Content-Language` 헤더를 이용
- **객체는 올바르게 압축이 풀릴 것이다.**
  - `Content-Length` 와 `Content-Encoding` 헤더를 이용
- **객체는 항상 최신이다.**
  - 엔티티 검사기와 캐시 만료 제어를 이용
- **사용자의 요구를 만족할 것이다.**
  - (내용협상을 위한 `Accept` 관련 헤더들에 기반하여)
- **네트워크 사이를 빠르고 효율적으로 이동할 것이다.**
  - 범위요청, 델타 인코딩, 그외의 데이터 압축을 이용
- **조작되지 않고 온전하게 도착할 것이다.**
  - 전송 인코딩 헤더와 Content-MD5 체크섬 이용

## 15.1 메시지는 컨테이너, 엔터티는 화물

### HTTP 메세지 엔터티는 엔터티 헤더와 본문으로 이루어진다. 헤더와 본문은 빈줄(CRLF)로 나눈다.

HTTP 엔터티 헤더는 HTTP 메세지의 내용물을 설명한다. HTTP/1.1은 다음과 같이 10가지 주요 엔터티 헤더 필드를 정의하였다.

| 헤더 필드        | 설명                                                                                                                                           |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Content-Type     | 엔터티에 의해 전달된 객체의 종류                                                                                                               |
| Content-Length   | 전달되는 메세지의 크기나 길이                                                                                                                  |
| Content-Language | 전달되는 객체와 가장 잘 대응되는 자연어                                                                                                        |
| Content-Encoding | 객체 데이터에 대해 행해진 변형(압축 등)                                                                                                        |
| Content-Location | 요청 시점을 기준으로, 객체의 또 다른 위치                                                                                                      |
| Content-Range    | 만약 이 엔터티가 부분 엔터티라면, 이 헤더는 이 엔터티가 전체에서 어느 부분에 해당하는지 정의한다.                                              |
| Content-MD5      | 엔터티 본문의 콘텐츠에 대한 체크섬                                                                                                             |
| Last-Modified    | 서버에서 이 콘텐츠가 생성 혹은 수정된 날                                                                                                       |
| Expires          | 이 엔터티 데이터가 더 이상 신선하지 않은 것으로 간주되기 시작하는 날짜와 시각                                                                  |
| Allow            | 이 리소스에 대해 어떤 요청 메서드가 허용되는지 (GET, HEAD..)                                                                                   |
| ETag             | 이 인스턴스에 대한 고유 검사기. 엄밀히 말해 ETag 헤더는 엔터티 헤더로 정의되어 있지는 않지만 엔터티와 관련된 많은 동작을 위해 중요한 헤더이다. |
| Cache-Control    | 어떻게 이 문서가 캐시될 수 있는지에 대한 지시자. ETag 헤더와 마찬가지로 Cache-Control 헤더도 엔터티 헤더로 정의되어있지는 않다.                |

### 15.1.1 엔터티 본문

엔터티 본문은 가공되지 않은 데이터만을 담고있다. 다른 정보들은 모두 헤더에 담겨있다.

예를 들어 `Content-Type` 엔터티 헤더는 우리에게 그 데이터(이미지, 텍스트 등)을 어떻게 해석해야 하는지 말해주며, `Conent-Encoding` 엔터티 헤더는 우리에게 그 데이터가 입축되었거나 혹은 추가적인 인코딩이 되었는지 말해준다.

엔터티 본문은 헤더 필드의 끝을 의미하는 빈 CRLF 줄 바로 다음부터 시작한다.

## 15.2 Content-Length: 엔터티의 길이

`Content-Length` 헤더는 메세지의 엔터티 본문의 크기를 바이트 단위로 나타낸다. 어떻게 인코딩 되었든 상관없이 크기를 표현할 수 있다.(gzip으로 압축된 텍스트 파일이라면 원래 크기가 아니라 압축된 후의 크기이다.)

`Content-Length` 헤더는 메세지를 청크 인코딩으로 전송하지 않는 이상, 엔터티 본문을 포함한 메세지에서는 필수적으로 있어야한다. `Content-Length` 헤더는 서버충돌로 인해 메세지가 잘렸는지 감지하고자 할 때와 지속 커넥션을 공유하는 메세지를 올바르게 분할하고자 할 때 필요하다.

### 15.2.1 잘림 검출

예전엔 HTTP 커넥션이 닫힌것을 보고 메세지가 끝났음을 인지하였으나, 이는 정상적으로 닫힌것인지 메세지 전송 중에 서버 충돌이 발생한 것인지 구분하지 못한다.

클라이언트는 메세지 잘림을 검출하기 위해 `Content-Length` 를 필요로한다.

메세지 잘림은 특히 캐싱 프락시 서버에서 취약한데, 잘린 메세지를 캐시하는 위험을 줄이기 위해 캐싱 프락시 서버는 명시적으로 `Conent-Length` 헤더를 갖고있지 않은 HTTP 본문은 캐시하지 않는다

### 15.2.2 잘못된 Content-Length

`Conent-Length`가 잘못된 값을 담고 있을 경우 아예 빠진것 보다도 큰 피해를 유발할 수 있다.

공식적으로 HTTP/1.1 사용자 에이전트는 잘못된 길이를 받고 그 사실을 인지했을 때 사용자에게 알려주게 되어있다.

### 15.2.3 Content-Length와 지속커넥션 (Persistent Connection)

`Conent-Length` 는 지속 커넥션을 위해 필수다. `Conent-Length` 헤더는 클라이언트에게 메세지 하나가 어디서 끝나고 다음 시작은 어디인지 알려준다. 커넥션이 지속적이기 때문에, 클라이언트가 커넥션이 닫힌 위치를 근거로 메세지의 끝을 인식하는 것은 불가능하다.

**청크 인코딩**을 사용할 경우는 `Conent-Length` 헤더 없ㅇ도 엔터티를 잘 정의된 크기의 조각들로 전송할 수 있다.

### 15.2.4 콘텐츠 인코딩

본문 콘텐츠가 인코딩 되어있다면, `Conent-Length` 헤더는 인코딩 되지 않은 원본의 길이가 아닌 인코딩된 본문의 길이를 바이트 단위로 정의한다.

HTTP/1.1 명세에 서술된 어떤 헤더도 인코딩 되지 않은 본문의 길이를 보내기 위해 사용될 수 없는데, 이는 클라이언트가 자신이 수행한 디코딩 과정에 문제가 없었는지 검증하기 어렵게 만든다.

### 15.2.5 엔터티 본문 길이 판별을 위한 규칙

1. 본문을 갖는것이 허용되지 않은 특정 타입의 HTTP 메세지에서는 본문 계산을 위한 `Conent-Length` \*\*\*\*헤더가 무시된다.
   가장 중요한 예는 HEAD응답이다. HEAD 메서드는 GET 요청을 보냈다면 받게될 응답에서 본문은 제외하고 헤더들만 보내라고 서버에 요청한다. GET 응답은 `Conent-Length` 헤더를 돌려주기 때문에 HEAD 응답 또한 그럴 것이다. 그러나 HEAD 응답은 본문을 갖지 않는다. 엔터티 본문을 금하는 메세지는 어떤 헤더 필드가 존재하냐와 상관없이 반드시 헤더 이후 첫번째 빈줄에서 끝나야한다.
2. 메세지가 `Transfer-Encoding` 헤더를 담고있다면 메세지가 커넥션이 닫혀서 먼저 끝나지 않는 이상 엔터티는 ‘0 바이트 청크’라고 불리는 특별한 패턴으로 끝나야한다.
3. `Transfer-Encoding` 헤더를 갖는 메세지를 받았다면 전송 인코딩은 엔터티 본문을 표현하고 전송하는 방식으로 바꿀 것이고, 이 헤더필드가 없다면 `Conent-Length` 헤더 필드의 값은 본문의 길이를 담게 된다.
4. 메세지가 `multipart/byteranges` 미디어 타입을 사용하고 엔터티 길이가 별도로 정의되지 않았다면 (Content-Length 헤더로.), 멀티파트 메세지의 각 부분은 각자가 스스로 크기를 정의할 것이다.
   이 멀티파트 유형은 자신의 크기를 스스로 결정할 수 있는 유일한 엔터티 본문 유형이다.
5. 위의 어떤 규칙에도 해당되지 않는다면, 엔터티는 커넥션이 닫힐 때 끝난다. 실질적으로 오직 서버만이 메세지가 끝났음을 알리기 위해서 커넥션을 닫을 수 있다.
6. HTTP/1.0 애플리케이션과의 호환을 위해 엔터티 본문을 갖고있는 HTTP/1.1 요청은 반드시 유효한 `Conent-Length` 헤더도 갖고 있어야 한다. HTTP/1.1 명세는 요청에 본문은 있지만 Content-Length 헤더는 없는 경우, 메세지의 길이를 판별할 수 없다면 400 Bad Request 응답을 보내고 유효한 Content-Length를 요구하고 싶다면 411 Length Required 응답을 보내라고 조언하고있다.

## 15.3 엔터티 요약

HTTP는 신뢰가는 TCP/IP 전송 프로토콜 위해서 구현되었음에 불구하고, 불완전한 트랜스코딩 프락시나 버그 많은 중개자 프락시를 비롯하여 여러가지 이유로 메시지 일부분이 전송중 변형되는 일이 발생된다.

엔터티 본문 데이터에 대한 의도하지 않은 변경을 감지하기 위해 최초 엔터티가 생성될 때 송신자는 데이터에 대한 체크섬을 생성할 수 있으며, 수신자는 그 체크섬으로 기본적인 검사를 통해 의도한지 않은 엔터티의 변경을 잡아낼 수 있다.

## 15.4 미디어 타입과 차셋(Charset)

`Conent-Length` 헤더 필드는 엔터티 본문의 MIME 타입을 기술한다.

- 흔히 쓰이는 미디어 타입

| 미디어 타입                   | 설명                                                                                          |
| ----------------------------- | --------------------------------------------------------------------------------------------- |
| text/html                     | 엔터티 본문은 HTML 문서                                                                       |
| text/plain                    | 엔터티 본문은 플레인 텍스트 문서                                                              |
| image/gif                     | 엔터티 본문은 GIF 이미지                                                                      |
| image/jpeg                    | 엔터티 본문은 JPEG 이미지                                                                     |
| audio/x-wave                  | 엔터티 본문은 WAV 음향 데이터를 포함                                                          |
| model/vml                     | 엔터티 본문은 삼차원 VRML 모델                                                                |
| application/vnd.ms-powerpoint | 엔터티 본문은 마이크로 소프트 파워포인트 프레젠테이션                                         |
| multipart/byteranges          | 엔터티 본문은 여러부분으로 나뉘는데, 각 부분은 전체 문서의 특정 범위(바이트 단위)를 담고있다. |
| message/http                  | 엔터티 본문은 완전한 HTTP 메세지를 담고있다.                                                  |

`Content-Type` 헤더가 **원본 엔터티 본문의 미디어 타입을 명시**하는것은 중요하다. 예를 들어 엔터티가 콘텐츠 인코딩을 거친 경우에도 `Content-Type` 헤더는 여전히 인코딩 전의 엔터티 본문유형을 명시할 것이다.

### 15.4.1 텍스트 매체를 위한 문자 인코딩

`Content-Type` 헤더는 내용 유형을 더 자세히 지정하기 위한 매개변수도 지원한다.

```html
Content-Type: text/html; charset=iso-8859-4
```

### 15.4.2 멀티파트 미디어 타입

MIME 멀티파트 이메일 메세지는 서로 붙어있는 여러개의 메세지를 포함하며, 하나의 복합 메세지로 보내진다.

각 구성 요소는 자족적으로 자신에 대해 서술하는 헤더를 포함한다.

### 15.4.3 멀티파트 폼 제출

HTTP 폼을 채워서 제출하면, 가변길이 텍스트 필드와 업로드 될 객체는 각각 멀티파트 본문을 구성하는 하나의 파트가 되어 보내진다. 멀티파트 본문은 여러 다른 종류와 길이의 값으로 채워진 폼을 허용한다.

```html
Content-Type: multipart/form-data; boundary=abcdefg --abcdefg
Content-Diposition: form-data; name="submit-name" Sally --abcdefg
Content-Diposition: form-data; name="files"; filename="essayfile.txt"
Content-Type: text/plain ...contents of essayfile.txt... --abcdefg--
```

이 때 boundary는 본문의 서로 다른 부분을 구분하기 위한 구분자로 쓰인다.

```html
Content-Type: multipart/mixed; boundary=my_unique_boundary_string
--my_unique_boundary_string Content-Type: text/plain; charset=UTF-8
Content-Transfer-Encoding: quoted-printable 안녕하세요! 이것은 multipart/mixed
메시지의 첫 번째 파트입니다. 일반 텍스트 데이터가 들어 있습니다. 특수 문자도 잘
인코딩됩니다: =EC=95=88=EB=85=95! --my_unique_boundary_string Content-Type:
image/jpeg Content-Transfer-Encoding: base64 Content-Disposition: attachment;
filename="example.jpg"
/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0a
HBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQoLCwsNDw4NDw4NFhANCgsLDAwL
DAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwL/wAARCAAwADAD
AREAAhEB/8QAGQAAAgMBAAAAAAAAAAAAAAAABAUAAwYH/8QAMBAAAgEDAgQDBwUAAAAAAAABAgME
AAURBhIHEyExQSJRYXGBkaEUMkJSYoLB/8QAGwEAAgMBAQEAAAAAAAAAAAAAAAMBAgQFBgf/xAAt
EQACAQIEBAUEAwAAAAAAAAABAgADEQQFIUESMVEGEzJhcYEiQqFSgaGx0f/aAAwDAQACEQMRAD8A
6iysLq9tIbi3hkaOZQyFegp4Nq+G3t/K/wCzI3/hG5oK7T9T1LS702+oRSxRscCRc4Yfj3rCqPZ
vB2k+1tC+v3H9e3H9I3P6e1Z3cE+8x+I/M+Z3d/K/wCzI3/hG5oM7uF/wCzI3/hG5oM7uF/wCz
I3/hG5oM7uF/wCzI3/hG5pBnu4X/syN/wCAbmgzu4X/ALMj/wDAo3NBndwv/Zkf/gG5p+Gj7fD
d/K/wCzI3/hG5oO7vB2k+1tC+v3H9e3H9I3P6e1WJc1h7R8L2mp6fHf20UsUMqhhIucr+PatrZ
xXq2sc+0o3/hG5oA13cQ/wB2Rv8Awjc0B3cQ/wB2Rv/CNzQHdxD/dkb/wjc0B3cQ/3ZG/8I3NA
F3cQ/wB2Rv/CNzQHdxD/AHZG/w8zc0B3cQ/3ZG/8I3NAF3cQ/wB2Rv8AwD/mgD+E/9k=
--my_unique_boundary_string--
```

### 15.4.4 멀티파트 범위 응답

다른 범위에 대한 응답 또한 멀티파트가 될 수있다.

## 15.5 콘텐츠 인코딩

HTTP 애플리케이션은 때때로 콘텐츠를 보내기 전에 인코딩을 하려한다. 전송시간을 줄이기휘함, 허가받지 않은 제삼자가 볼 수없도록 암호화 등의 이유가 있을 수 있다.

### 15.5.1 콘텐츠 인코딩 과정

1. 웹 서버가 원본 `Content-Type`과 `Content-Length` 헤더를 수반한 원본 응답 메세지를 생성한다.
2. 콘텐츠 인코딩서버(아마 원 서버거나 다운스트림 프락시일것임)가 인코딩된 메세지를 생성한다.
   인코딩된 메세지는 `Content-Type`은 같지만 (본문이 압축되었거나 했다면) `Content-Length` 는 다르다.
   콘텐츠 인코딩 서버는 `Content-Encoding` 헤더를 인코딩된 메세지에 추가하여 수신측 애플리케이션이 그것을 디코딩할 수 있도록 한다.
3. 수신측 프로그램은 이코딩도니 메세지를 받아서 디코딩하고 원본을 얻는다.

### 15.5.2 콘텐츠 인코딩 유형

HTTP는 몇가지 표준 콘텐츠 인코딩 유형을 정의하고 확장 인코딩으로 인코딩을 추가하는것도 허용한다.

- 흔히 쓰이는 콘텐츠 인코딩 토큰 (이중 gzip이 일반적으로 가장 효율적이고 널리 쓰이는 압축알고리즘임)

| 콘텐츠 인코딩 값                                                 | 설명                                                                     |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------ |
| gzip                                                             | 엔터티에 GNU zip 인코딩이 적용되었음을 의미                              |
| compress                                                         | 엔터티에 대해 유닉스 파일 압축 프로그램인 ‘compress’가 실행되었음을 의미 |
| deflate                                                          | 엔터티가 zilb 포맷으로 압축되었음을 의미                                 |
| identity                                                         | 엔터티에 어떤 인코딩도 수행되지 않았음을 의미.                           |
| Content-Encoding 헤더가 존재하지 않는다면 이 값인 것으로 간주함. |

### 15.5.3 Accept-Encoding 헤더

서버에서 클라이언트에서 지원하지 않는 인코딩을 사용하는것을 방지하기 위해 클라이언트는 `Accept-Encoding` 요청헤더를 통해 원하는 인코딩 목록을 헤더로 전달한다.

헤더에 포함하지 않는다면 어떤 인코딩이든 허용한다는 뜻(\* 도 같은 의미)

```html
Accept-Encoding: compress, gzip Accept-Encoding: Accept-Encoding: *
Accept-Encoding: gip;z-1.0, identity; q-0.5, *;q=0
```
