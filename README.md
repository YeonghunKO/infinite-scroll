# 간략 소개 👁‍🗨

![infinite](https://user-images.githubusercontent.com/65995664/144510299-2dfde660-9ef0-4db8-82ea-9b57cb185398.gif)


`https://jsonplaceholder.typicode.com/` 에서 dummy data를 받아와서 나름대로 만들어본 블로그 페이지.

역시나 컴포넌트 방식으로 구현.

1. 이름 그대로 무한 스크롤 가능 

2. 검색가능(검색할때마다 자동으로 하이라이트 되며 해당 포스트만 출력됨). 검색할때는 무한 스크롤이 작동안함.

3. refresh 버튼을 누르면 원래대로 돌아옴


# 배운점 📖

## CSS

1. post의 position을 relative로 한 이유는. post number를 absolute로 해서 위치를 `container안에서` 자유롭게 설정하기 위함이다. absolute는 부모의 위치를 기준으로 한다.

2. nth-child / first-of-type과 같은 seletor들은 같은 group안에 있는 sibling들 사이에서만 효력이 있다. 다른 group에 있는 sibling들은 효력이 없다(첫번째 .post 에만 margin-top을 적용하려고 하다가 알아낸 사실)

3. keyframe에서 %는 animation에서 적용했던 duration에 해당하는 %이다. 예를 들어, 10s라고 duration을 설정하면, 50%는 5초구간이라는 뜻이다.

4. body > main이라고 했을 때 아래와 같다고 해보자

```css
body {
    height: 100vh
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.main {
    height: 없음
}
```

그럼 25개의 포스트가 main안에 있다고 했을때 12번 부터 출력된다.

해결방법은?

- `justify-content: center;` 를 없애주자.
- body에서 height를 제거해주자.
  - 제한이 풀리면서 자연스레 1번부터 출력된다.

만약 main에 height 100vh를 걸어주면 화면 끝까지 꽉차게 되면서 loader가 있어야할 자리까지 침범하게 된다. 따라서 main에는 height를 없애주자

5. animation-delay 를 통해 loader들이 물결파동을 일으키는 효과를 구현할 수 있게 되었다.

## HTML

1. post-container 도 그렇고 post-info도 그렇고 감싸는걸 잘 해야한다. 잘 감싸야 flex, grid를 통한 정렬이 가능하다. 그리고 class를 통한 다중 변경도 용이하다.

## JS

1. 무언가 실행되었는지 알고 싶나? 그럼 `determine`이란 단어를 잘 기억해 두자. (ex) Determine if scrolled to bottom )

2. 특정 변수 + 변수를 가리키는 모든 reference의 이름을 변경하고 싶다면 클릭한다음에 f2를 누르면 변경가능하다.

3. 효율을 높이기 위해 virtual DOM, 선별적으로 하이라이트, 클래스 토글 기법을 이용함.

4. async 함수를 constructor 함수로 사용할 수 없는 이유: async는 태생적으로 미래에 완료될 Promise객체를 리턴한다. 그러나 constructor는 객체를 미래가 아닌 생성되자마자 바로 리턴해야한다. 그러므로 미래에 사용될 객체를 바로 리턴한다는 말 자체가 모순이다. 둘 중 하나만 리턴할 수 있다. 따라서 async는 Promise만 리턴해야하므로 생성자 함수가 될 수 없다.

5. App안에서 일반함수가 아닌 arrow function을 이용하여 표현식으로 만드는 이유는 this를 App으로 해주기 위함이다. 일반함수안에서 this를 사용하면 this가 App이 아니라 그 함수가 되어버린다.(만약, new를 통해서 생성자를 만들어내지 않으면 this가 undefined가 되어버릴 것이다.) 따라서 선언된 스코프를 따라 올라가는 arrow function을 사용하는 것이다. 하지만 this(App)를 사용하지 않는다면 일반 함수를 App안에 만들어내도 상관없다.

6. 컴포넌트로 만들고 난뒤에는 scroll 하는곳에 async함수 대신 debounce를 사용하여 fetch되는 속도를 컨트롤해봄

   - debounce할때 timer는 debounce되는 함수 밖에 위치해야한다. 안그럼, 스크롤 할때마다 timer 변수가 새로 생성이 되어버려서 timer가 clear되지 않는다.

7. posts.render에서 addPosts인 경우 새로운 posts를 fetch해오는 대신 allPostsStorage를 posts에 넘겨주고 `querySelector('.post-container[data-id="${id}"]') === null` 처럼 `querySelector`를 이용해 `main`에 없는 posts만 render되도록 해보았다.

8. scroll 이벤트도 posts 컴포넌트에서 관리할까 하다가 App에서 관리하도록 했다. 이유는, LIMIT,PAGE에 따라서 App.allPostsStorage 가 바뀌기 때문이다.
