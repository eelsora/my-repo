# 7. 캐시

웹 캐시는 자주 쓰이는 문서의 사본을 자동으로 보관하는 HTTP 장치다. 웹 요청이 캐시에 도착했을 때, 캐시된 로컬 사본이 존재한다면, 그 문서는 원 서버가 아니라 그 캐시로부터 제공된다.

## 7.1 불필요한 데이터 전송

복수의 클라이언트가 자주 쓰이는 원 서버페이지에 접근할 때, 서버는 같은 문서를 클라이언트에게 각각 한 번씩 전송한다. 이 불필요한 데이터 전송은 값비싼 네트워크 대역폭을 잡아먹고, 전송을 느리게 만들며, 웹 서버에 부하를준다. 캐시를 이용하면 첫 번째 서버 응답은 캐시에 보관되고, 뒤이은 요청들은 사본으로 응답될 수 있기 때문에 트래픽 낭비가 줄어들 수 있다.

## 7.2 대역폭 병목

많은 네트워크가 원격 서버보다 로컬 네트워크 클라이언트에 더 넓은 대역폭을 제공한다. 클라이언트들이 서버에 접근할 때의 속도는, 그 경로에 있는 가장 느린 네트워크의 속도와 같다. 만약 클라이언트가 빠른 LAN에 있는 캐시로부터 사본을 가져온다면, 캐싱은 성능을 대폭 개선할 수 있을 것이다.

## 7.3 갑작스런 요청 쇄도(Flash Crowds)

캐싱은 갑작스런 사건, 속보, 스팸 메일 등으로 인해 동시에 사람들이 웹문서에 접근할때를 대처하기 위해 특히 중요하다. 갑작스런 요청 쇄도는 웹 서버에 과부하를 준다.

## 7.4 거리로 인한 지연

모든 네트워크 라우터는 제각각 인터넷 트래픽을 지연시킨다. 그리고 클라이언트와 서버 사이에 라우터가 그다지 많지 않더라도, 빛의 속도 그 자체가 유의미한 지연을 유발한다.

병렬이면서 keep-alive인 커넥션이라 할지라도, 빛의 속도는 뚜렷한 지연을 발생시킨다. 신호는 빛보다 약간 느리게 이동하므로 거리로 인한 지연은 이보다 더 크다.

## 7.5 적중과 부적중

캐시에 요청이 도착했을 때, 만약 그에 대응하는 사본이 있다면 그를 이용해 요청이 처리되는 것을 캐시 적중`cache hit` 이라고 한다.

만약 대응하는 사본이 없다면 그냥 원 서버로 전달만 되는데 이를 캐시 부적중 `cache miss`라고한다.

### 7.5.1 재검사(Revalidation)

원 서버 콘텐츠는 변경될 수 있기 때문에, 캐시는 반드시 그들이 갖고있는 사본이 여전이 최신인지 서버를 통해 때때로 점검해야한다. 이런 신선도 검사를 HTTP 재검사 라고 한다.

캐시는 스스로 원한다면 언제든지 사본을 재검사 할 수 있다. 하지만 캐시가 문서를 수백만 개씩 갖고 있는 경우가 흔하여 네트워크 대역폭이 부족하기 때문에 충분히 오래된 경우에만 재검사를 한다.

캐시는 캐시된 사본의 재검사가 필요할 때, 원 서버에 작은 재검사 요청을 보낸다. 콘텐츠가 변경되지 않았다면, 서버는 아주 작은 `304 Not Modified` 응답을 보낸다. 이를 재검사 적중 혹은 느린 적중이라고 한다.

HTTP는 재검사를 위해 `If-Modified-Since` 헤더를 사용한다

```markdown
### 1. 재검사 적중(느린 적중) - 캐시된 사본과 같은 서버 객체 (캐시 객체 전달)

1. client -> server
   클라이언트 -> 캐시 -> [신선도 검사] -> 서버
2. server -> client
   서버 -> [여전시 신선] -> 캐시 -> 캐시객체 -> 클라이언트

### 2. 재검사 부적중 - 캐시된 사본의 유효기간이 지남 (서버 객체 전달)

1. client -> server
   클라이언트 -> 캐시 -> [신선도 검사] -> 서버
2. server -> client
   서버 -> 서버객체 -> 캐시 -> 서버객체 -> 클라이언트
```

- **재검사 적중**
  - 만약 서버객체가 변경되지 않았다면, 서버는 클라이언트에게 작은 HTTP 304 Not Modified 응답을 보낸다.

```markdown
- 캐시 -> 서버 (If-Modified-Since를 이용한 재검사 요청)
  GET /announce.html HTTP/1.0
  If-Modified-Since: Sat, 29 Jun 2002, 14:30:00 GMT

- 서버 -> 캐시 ("여전히 신선" 응답)
  HTTP/1.0 304 Not Modified
  Date: Wed, 03 Jul 2002, 19:18:23 GMT
  Content-type: text/plain
  Content-length: 67
  Expires: Fri, 05 Jul 2002, 05:00:00 GMT
```

- **재검사 부적중**
  - 만약 서버 객체가 캐시된 사본과 다르다면, 콘텐츠 전체와 함께 `HTTP 200 OK` 응답을 클라이언트에게 보낸다.
- **객체 삭제**
  - 만약 서버 객체가 삭제 되었다면, 서버는 `404 Not Found` 응답을 돌려보내며, 캐시는 사본을 삭제한다.

### 7.5.2 적중률

캐시가 요청을 처리하는 비율을 캐시 적중률, 문서 적중률 이라고 부르기도 한다. 적중률은 0~1까지의 값으로 되어있지만 퍼센트로 표현하기도 한다.

적중률 40%면 웹 캐시로 괜찮은 편이다. 0%는 모든 요청이 캐시 부적중임을(네트워크로 문서를 가져옴), 100%는 모든 요청이 캐시 적중임(캐시에서 사본을 가져옴)을 의미한다

캐시는 유용한 콘텐츠가 캐시 안에 머무르도록 보장하기 위해 노력한다.

### 7.5.3 바이트 적중률

문서들이 모두 같은 크기인 것은 아니기 때문에 문서 적중률이 모든 것을 말해주진 않는다. 바이트 단위 적중률 측정값을 선호하는 사람도 있다. (트래픽의 모든 바이트에 요금을 매기려는 사람들이 그렇다함).

바이트 단위 적중률은 캐시를 통해 제공된 모든 바이트의 비율을 표현한다. 바이트 단위 적중률 100%는 모든 바이트가 캐시에서 왔으며, 어떤 트래픽도 인터넷으로 나가지 않았음을 의미한다.

문서 적중률과 바이트 단위 적중률은 둘 다 캐시 성능에 대한 유용한 지표이다. 문서 적중률은 얼마나 많은 웹 트랜잭션을 외부로 내보내지 않았는지 보여준다.

바이트 단위 적중률의 개선은 대역폭 절약을 최적화한다.

## 7.6 캐시 토폴로지

- 한 명에게만 할당된 캐시 : 개인 전용 캐시(private cache)
- 공유된 캐시: 공용캐시 (public cache)

### 7.6.1 개인 전용 캐시

웹 브라우저는 개인 전용 캐시를 내장하고 있다. 대부분의 브라우저는 자주 쓰이는 문서를 개인용 컴퓨터의 디스크와 메모리에 캐시해 놓고, 사용자가 캐시 사이즈와 설정을 수정할 수 있도록 허용한다. 개인 전용 캐시는 많은 에너지나 저장 공간을 필요로 하지 않으므로, 작고 저렴할 수 있다.

- 익스플로러 > 도구> 인터넷 옵션> 검색기록>설정>파일보기→ 캐시 콘텐츠를 얻을 수 있음

### 7.6.2 공용 프락시 캐시(프락시 캐시)

프락시 캐시는 로컬 캐시에서 문서를 제공하거나, 사용자 입장에서 서버에 접근한다. 공용 캐시에는 여러 사용자가 접근하기 때문에 불필요한 트래픽을 줄일 수 있는 기회가 많다. 자주 찾는 객체를 단 한번만 가져와 모든 요청에 대해 공유된 사본을 제공함으로써 네트워크 트래픽을 줄인다.

### 7.6.3 프락시 캐시 계층들

캐시 계층이 깊다면 요청은 캐시의 긴 연쇄를 따라갈 것이기 때문에 연쇄가 길어질 수록 각 중간 프락시는 현저한 성능 저하가 발생될 것이다.

부모 캐시는 관심사가 제각각인 많은 자식 캐시들로부터 트래픽을 모두 감당해야 하므로 더 크고 고성능 이여야 한다.

### 7.6.4 캐시망, 콘텐츠 라우팅, 피어링

몇몇 네트워크 아키텍처는 단순한 캐시 계층 대신 복잡한 캐시망을 만든다. 캐시망의 프락시 캐시는 복잡한 방법으로 서로 대화하여, 어떤 부모 캐시와 대화할 것인지, 아니면 요청이 캐시를 완전 우회해서 원 서버로 바로 가도록 할 것인지 결정을 동적으로 내린다.

- URL에 근거하여, 부모 캐시와 원 서버 중 하나를 동적으로 선택한다.
- URL에 근거하여 특정 부모 캐시를 동적으로 선택한다.
- 부모캐시에게 가기 전에, 캐시된 사본을 로컬에서 찾아본다.
- 다른 캐시들이 그들의 캐시된 콘텐츠에 부분적으로 접근할 수 있도록 허용하되, 그들의 캐시를 통한 인터넷 트랜짓(트래픽이 다른 네트워크로 건너가는 것)은 허용하지 않는다.

## 7.7 캐시 처리 단계

### 7.7.1 단계1: 요청 받기

캐시는 네트워크로부터 도착한 요청 메세지를 읽는다.

고성능 캐시는 데이터를 동시에 읽어들이고, 메세지 전체가 도착하기 전에 트랜잭션 처리를 시작한다.

### 7.7.2 단계2: 파싱

캐시는 메세지를 파싱하여 URL과 헤더들을 추출한다. 이 과정을 통해 캐싱 소프트웨어가 헤더 필드를 처리하고 조작하기 쉽게 만들어준다.

### 7.7.3 단계3: 검색

캐시는 로컬 복사본이 있는지 검사하고, 사본이 없다면 사본을 받아온다. (그리고 로컬에 저장한다.)

캐시된 객체는 서버 응답 본문과 원 서버 응답 헤더를 포함하고 있으므로, 캐시 적중 동안 올바른 서버 헤더가 반환될 수 있다. 캐시된 객체는 또한 객체가 얼마나 오랫동안 캐시에 머무르고 있었는지를 알려주는 기록이나 얼마나 자주 사용되었는지 등에 대한 몇몇 메타 데이터를 포함한다.

### 7.7.4 단계4: 신선도 검사

HTTP는 캐시가 일정 기간 동안 서버의 문서의 사본을 보유할 수 있도록 해준다.

캐시는 캐시된 사본이 충분히 신선한지 검사하고, 신선하지 않다면 변경사항이 있는지 서버에게 물어본다.

### 7.7.5 단계5: 응답 생성

캐시는 새로운 헤더와 캐시된 본문으로 응답 메세지를 만든다.

캐시가 Date 헤더를 조정해서는 안된다는것을 주의해야한다. Date 헤더는 그 객체가 원 서버에서 최초로 생겨난 일시를 표현하는 것이다.

### 7.7.6 단계6: 발송

캐시는 네트워크를 통해 응답을 클라이언트에게 돌려준다.

### 7.7.7 단계7: 로깅

선택적으로, 캐시는 로그파일에 트랜잭션에 대해 서술한 로그 하나를 남긴다.

## 7.8 사본을 신선하게 유지하기

### 7.8.1 문서만료

HTTP는 `Cache-Control`과 `Expires`라는 특별한 헤더들을 이용해서 원 서버가 각 문서에 유효기간을 붙일 수 있게 해준다.

### 7.8.2 유효기간과 나이

| 헤더                   | 설명                                                                                                                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Cache-Control: max-age | max-age 값은 문서의 최대 나이를 정의한다. 최대 나이는 문서가 처음 생성된 이후부터, 신선하지 않다고 간주될 때까지 경과한 시간의 최댓값(초 단위)이다. \`Cache-Control: max-age=484200` |
| Expires                | 절대 유효기간. 유효기간이 지났다면 만료된 문서임.\`Expires: Fri, 05 Jul 2002, 05: 00:00 GMT`                                                                                         |

### 7.8.3 서버 재검사

캐시된 문서가 만료되었다는 것은 검사할 시간이 되었음을 의미한다.

‘원서버에 현재 존재하는것과 실제 존재하는 것이 다르다’ 가 아닌 ‘변경되었는지 여부를 물을때가 되었다’는 것을 의미함.

- 재검사 결과 콘텐츠가 변경되었다면, 캐시는 그 문서의 새로운 사본을 가져와 오래된 데이터 대신 저장한 뒤 클라이언트에게도 보내준다.
- 재검사 결과 콘텐츠가 변경되지 않았다면, 캐시는 새 만료일을 포함한 새 헤더들만 가져와서 캐시 안의 헤더들을 갱신한다.

### 7.8.4 조건부 메서드와 재검사

| 헤더                        | 설명                                                                                                                                                                                                 |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| If-Modified-Since: `<date>` | 만약 문서가 주어진 날짜 이후로 수정되었다면 요청 메서드를 처리한다. 이것은 캐시된 버전으로 콘텐츠가 변경된 경우에만 콘텐츠를 가져오기 위해 Last-Modified 서버 응답 헤더와 함께 사용된다.             |
| If-None-Match: `<tags>`     | 마지막 변경된 날짜를 맞춰보는 대신, 서버는 문서에 대한 일련번호와 같이 동작하는 특별한 태그를 제공할 수 있다. If-None-Match 헤더는 캐시된 태그가 서버에 있는 문서의 태그와 다를때만 요청을 처리한다. |

### 7.8.5 If-Modified-Since: 날짜 재검사

`IMS` 요청으로 불림.

- 문서가 주어진 날짜 이후에 변경되었다면, GET 요청은 성공하고 새문서가 새로운 만료 날짜와 그 외 정보들이 담긴 헤더들과 함께 캐시에게 반환됨.
- 문서가 주어진 날짜 이후에 변경되지 않았다면 `304 Not Modified`를 반환함.
  응답은 헤더들을 포함하지만 원래 돌려줘야할 것에서 갱신이 필요한것만 보내줌.

### 7.8.6 If-None-Match: 엔터티 태그 재검사

최근 변경 일시 재검사가 적절히 행해지기 어려운 상황이 있을 수 있음.

캐시가 객체에 대한 여러개의 사본을 갖고 있는 경우, 그 사실을 서버에 알리기 위해 하나의 `If-None-Match`헤더에 여러개의 엔터티 태그를 포함시킬 수 있다

```markdown
If-Not-Math: "v2.6"
If-Not-Math: "v2.4", "v2.5", "v2.6"
If-Not-Math: "foobar", "A8SD9DF7"
```

### 7.8.7 약한 검사기와 강한 검사기

- 약한 검사기(weak validator)
  - ‘그정도면 같은것’이라고 서버가 주장할수 있도록 해줌. → 어느정도 콘텐츠 변경을 허용
  - ‘W/’ 접두사로 구분함
    ```markdown
    ETag: W/"v2.6"
    If-None-Match: W"v2.6"
    ```
- 강한 검사기(strong validator)
  - 콘텐츠가 바뀔 때 마다 바뀜

### 7.8.8 언제 엔터티 태그를 사용하고 언제 Last-Modified 일시를 사용하는가

- 서버가 엔터티 태그 반환 → 클라이언트는 반드시 엔터티 태그 검사기 사용
- 서버가 Last-Modified 값만 반환 → 클라이언트는 If-Modified-Since 검사 사용 가능
- HTTP/1.1 캐시나 서버가 If-Modified-Since와 엔터티 조건부 헤더를 모두 받았다면 모든 조건부 헤더 필드의 조건이 부함되지 않는한 304 Not Modified 반환을 해선 안됨.

## 7.9 캐시 제어

HTTP는 문서가 만료되기 전까지 얼마나 오랫동안 캐시될 수 있게 할 것인지 서버가 설정할 수 있다.

- `Cache-Control: no-store` 헤더를 응답에 첨부할 수 있다.
- `Cache-Control: no-cache` 헤더를 응답에 첨부할 수 있다.
- `Cache-Control: must-revalidate` 헤더를 응답에 첨부할 수 있다.
- `Cache-Control: max-age` 헤더를 응답에 첨부할 수 있다.
- `Expires` 날짜 헤더를 응답에 첨부할 수 있다.
- 아무 만료 정보도 주지 않고, 캐시가 스스로 체험적인(휴리스틱) 방법으로 결정하게 할 수 있다.

### 7.9.1 no-cache와 no-store 응답 헤더

- `no-store`: 캐시가 그 응답의 사본을 만드는 것을 금지한다.
- `no-cache`: 로컬 캐시 저장소에 저장될 수 있다. 다만 먼저 서버와 재검사를 하지 않고서는 캐시에서 클라이언트로 제공될 수 없다. → 재검사 없이 캐시에서 제공하지마!!

### 7.9.2 Max-Age 응답헤더

문서가 서버로부터 온 이후로 흐른 시간. 초단위

```markdown
Cache-Control: max-age=3600
Cache-Control: s-max-age=3600 // 공유된 공용 캐시에서만 적용됨.
```

### 7.9.3 Expires 응답헤더

실제 만료 시간 명시.

Expires:0 쓰면안됨 XXX

### 7.9.4 Must-Revalidate 응답헤더

캐시가 이 객체의 신선하지 않은 사본을 원 서버와의 최초의 재검사 없이는 제공되어서는 안됨을 의미.

must-revalidate 신선도 검사를 시도했을 때 원 서버가 사용할 수 없을 상태라면, 캐시는 반드시 `504 Gatewaty Timeout error` 를 반환해야함

### 7.9.5 휴리스틱 만료

- 만약 캐시된 문서가 마지막으로 변경된 것이 오래됐다면 그것은 아마 바뀔 가능성이 없는 안정적인 문서일 것이므로 캐시에 더 오래 보관하고 있어도 안전하다.
- 만약 캐시된 문서가 최근에 변경되었다면, 자주 변경될 것이기 때문에 짧은 기간동안만 캐시해야함.

휴리스틱 신선도 계산은 생각보다 흔하게 하게되는 일이며, 많은 원 서버들이 아직도 Expires와 max-age 헤더를 생성하지 못한다. 캐시의 만료 기본값을 신중하게 선택하라!!!

### 7.9.6 클라이언트 신선도 제약

| 지시어                                                            | 목적                                                                                                                                                                                           |
| ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Cache-Control: max-stale` <br/> `Cache-Control: max-stale = <s>` | 캐시는 신선하지 않은 문서라도 자유롭게 제공할 수 있다. 만약 `<s>`매개변수가 지정되면, 클라이언트는 만료 시간이 그 매개변수의 값 만큼 지난 문서도 받아들인다. 이것은 캐싱 규칙을 느슨하게 한다. |
| `Cache-Control: min-fresh = <s>`                                  | 클라이언트는 지금으로부터 적어도 `<s>`초 후 까지 신선한 문서만을 받아들인다. <br /> 이것은 캐싱 규칙을 엄격하게 한다.                                                                          |
| `Cache-Control: max-age = <s>`                                    | 캐시는 `<s>`초보다 오랫동안 캐시된 문서를 반환할 수 없다. <br />나이가 유효기간을 넘어서게 되는 max-stale 지시어가 함께 설정되지 않는 이상, 이 지시어는 캐싱 규칙을 더 엄격하게 만든다.        |
| `Cache-Control: no-cache` <br /> `Pragma: no-cache`               | 이 클라이언트는 캐시된 리소스는 재검사하기 전에는 받아들이지 않을 것이다.                                                                                                                      |
| `Cache-Control: no-store`                                         | 이 캐시는 저장소에서 문서의 흔적을 최대한 빨리 삭제해야한다. <br/> 그 문서에는 민감한 정보가 포함 되어있기 때문이다.                                                                           |
| `Cache-Control: only-if-cached`                                   | 클라이언트는 캐시에 들어있는 사본만을 원한다.                                                                                                                                                  |

## 7.10 캐시 제어 설정

### 7.10.1 아파치로 HTTP 헤더 제어하기

아파치 웹 서버는 HTTP 캐시 제어 헤더를 설정할 수 있는 여러가지 매커니즘을 제공하는데, 이 매커니즘들 중 많은것이 디폴트로는 가능하지 않아 사용하려면 활성화해야한다.

- **mod_headers**

  - 개별 헤더들을 설정할 수 있게 해준다.

    ```markdown
    <File \*.html>
    Header set Cache-Control no-cache
    </File>

    // 어떤 디렉터리의 모든 html 파일을 캐시되지 않도록 설정
    ```

- **mod_expires**
  - 적절한 만료 날짜가 담긴 Expires 헤더를 자동으로 생성하는 프로그램 로직 제공
    ```markdown
    ExpiresDefault A3600
    ExpiresDefault M86400
    // 파일 종류별로 다른 만료 날짜를 설정할 수 있게 해준다.
    ExpiresDefault "access plus 1 week"
    ExpiresByType text/html "modification plus 2 days 6 hours 12 minuites"
    ```
- **mod_cern_meta**
  - HTTP 헤더들의 파일을 특정 객체와 연결시켜준다.

### 7.10.2 HTTP-EQUIV를 통한 HTML 캐시 제어

```html
<html>
  <head>
    <title></title>
    <meta http-equiv="Cache-Control" content="no-cache" />
  </head>
  ,,,
</html>
```

일반적으로 `<META HTTP-EQUIV>` 태그는 캐시 만료에 대한 동작에 혼란을 초래함.

문서의 캐시 제어 요청과 커뮤니케이션 하는 확실한 방법은 올바르게 설정된 서버가 보내온 HTTP 헤더를 이용하는 것이다.

### 7.11 자세한 알고리즘

HTTP 명세는 문서의 나이와 캐시 신선도를 계산하는 알고리즘을 제공한다.

(관심없다면 건너뛰어도 된다길래 건너뜀;;)

### 7.12 캐시와 광고

지금까지의 내용을 이해 하였다면, 캐시가 성능을 개선하고 트래픽을 줄인다는 것을 깨달았을 것이다.

캐시는 사용자를 도와 더 좋은 경험을 제공하고, 또한 네트워크 사업자들이 트래픽을 줄일 수 있도록 도와준다.
