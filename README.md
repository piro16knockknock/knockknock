![image](https://user-images.githubusercontent.com/71166763/158158860-7bcc7e89-a655-4745-846b-03dfe905ae64.png)
# 🚪 Knock/Knock

```“...knock knock!”```  
한 지붕 아래 함께 살아가는 사람들과의 안정적인 거주 생활을 도와주기 위한 생활 관리 서비스.  
  
<b>테스트 서버 ▶ https://knockknock.tk/ ◀</b>
  
## 📍 기획 배경
COVID-19의 장기화와 함께 동거인과의 시간은 점점 늘어나고 어려워져만 가는 청년들의 내 집 마련으로 하우스 쉐어의 수요는 꾸준하다.  
이러한 배경 속, <b>룸메이트와의 생활을 관리할 수 있는 서비스</b>를 만들면 어떨까 하는 생각에서 시작하게 된 프로젝트.  
  
<b>```Knock/Knock:```</b> "아무리 한 집 아래에 산다해도 노크 정도는 하고 살자!"는 의미.

## 🔨 Tools
- <b>Prototype</b> : <img align="center" src="https://img.shields.io/badge/Figma-F24E1E?style=flat-square&logo=Figma&logoColor=white"/>  
- <b>Framework</b> : <img align="center" src="https://img.shields.io/badge/Django-092E20?style=flat-square&logo=Django&logoColor=white"/>  
- <b>Deployment</b> : <img align="center" src="https://img.shields.io/badge/AWS-FF9900?style=flat-square&logo=Amazon AWS&logoColor=white"/>  
- <b>Collaboration</b> : <img align="center" src="https://img.shields.io/badge/Slack-4A154B?style=flat-square&logo=Slack&logoColor=white"/> <img align="center" src="https://img.shields.io/badge/Notion-000000?style=flat-square&logo=Notion&logoColor=white"/> 

## 📄 ERD
![ERD](https://user-images.githubusercontent.com/71166763/158162295-5c34d733-2da1-44ba-8be4-318507c9bb0d.png)

## ✨ 기능 소개
룸메이트와의 생활 관리를 위한 기능에 중심을 두어 <i>주기능 2가지</i> 와 <i>부기능 4가지</i> 를 정하였다.
- <b>주기능</b>
    <details>
      <summary>1. 공유 캘린더</summary>
      <div>
        - 공유 캘린더에서는 빨래, 청소, 기타 등의 카테고리에 따른 할일을 추가, 수정, 삭제 및 확인할 수 있다.<br/>
        - 원하는 카테고리를 직접 추가하는 것 또한 가능하며, 각 할 일에 대한 담당자를 정할 수 있다.<br/>
        - 룸메이트와 나의 할 일 달성률을 확인할 수 있다.</div>
    </details>
    <details>
      <summary>2. 생활 수칙</summary>
      <div>
        - 생활수칙 기능을 통해 사용자는 룸메이트와의 생활수칙을 정할 수 있다.<br/>
        - 생활수칙을 정하기 어렵다면 사이트에서 제공하는 가이드라인을 이용하여 생활수칙을 만들 수 있다.</div>
    </details>
    
- <b>부기능</b>
    <details>
      <summary>1. 집 등록 / 노크 / 룸메이트 초대</summary>
      <div>
        - 노크노크를 처음 시작하는 사용자는 집을 등록할 수 있다.<br/>
        - 집 등록 후, 유저를 검색해서 룸메이트 초대를 하면 같은 집의 구성원이 된다. <br/>
        - 혹은 초대링크를 통해서나 집을 직접 검색하여 ‘노크’하는 방법으로 사용자는 기존에 존재하는 집에 들어갈 수 있다.</div>
    </details>
    <details>
      <summary>2. 이사가기 / 이전 집 기록 보기 / 이전 집 생활 수칙 가져오기</summary>
      <div>
        - 사용자는 이사가기 버튼을 통해 집을 나올 수 있다. 마이페이지에서 과거 집들의 룸메이트나 생활기록을 확인할 수 있다. <br/>
        - 만일, 새로운 집에 들어갔다면 이전 집 생활수칙 가져오기 기능을 통해 이전에 작성했던 생활수칙을 불러올 수 있다.</div>
    </details>
    <details>
      <summary>3. 커뮤니티(추후 개발 예정)</summary>
      <div>
        - 커뮤니티에서 룸메이트와의 동거생활에 대한 게시물을 자유롭게 작성하고 댓글을 남길 수 있다.</div>
    </details>
    <details>
      <summary>4. 유저 칭호</summary>
      <div>
        - 생활 관리에 대한 동기 부여를 위해 할일 달성에 따라 유저 칭호가 부여되며, 사용자가 대표 칭호를 직접 선택할 수 있다.</div>
    </details>
    
---
## 🏡 사이트 소개
![노크노크](https://user-images.githubusercontent.com/71166763/158522315-9765e9fa-5a15-4de9-b992-9dcd2d193b13.png)
### 1. 🏠 Main Page
서비스 소개 페이지. 오늘의 할 일을 바로 확인할 수 있다.
![슬라이드2](https://user-images.githubusercontent.com/71166763/158203563-13df0aa9-ecde-4e86-8acf-6509d372c9bf.PNG)
  
### 2. 📅 캘린더
<b>캘린더 메뉴</b>에서는 할 일을 룸메이트와 함께 정할 수 있다.  
<b>지난 날짜의 할 일 페이지</b>에서는 달성률을 시각적으로 확인할 수 있다. 
  
![슬라이드 2](https://user-images.githubusercontent.com/71166763/158220805-2000d170-0254-4d97-9eff-19c541f40a56.png)
  
    
<b>내 할 일 페이지</b>에서는 카테고리를 자유롭게 추가하여 할 일을 설정할 수 있으며,  
<b>전체 할 일 페이지</b>에서는 집 안 구성원 전체의 할 일을 확인할 수 있고, 직접 할 일의 담당을 정해줄 수 있다.  
  
![슬라이드3](https://user-images.githubusercontent.com/71166763/158220131-3839af1f-3753-41b9-a4f5-61d0ad5587a1.PNG)


### 3. 👪 생활 수칙
<b>생활 수칙 메뉴</b>에서는 살고있는 집의 생활 수칙을 자유롭게 추가하거나 수정, 삭제할 수 있다.  
생활 수칙 작성에 어려움을 겪는다면 <b>가이드라인</b>을 활용하여 생활수칙을 생성할 수 있다.  
![슬라이드4](https://user-images.githubusercontent.com/71166763/158220157-fbcda5e3-4c36-423d-8247-f7f679c78efd.PNG)


### 4. ⚙️ 설정
<b>설정의 집 관리 페이지</b>에서는 집 정보를 변경할 수 있고, 룸메이트를 초대하거나 초대 링크를 복사할 수 있다.  
<b>룸메이트 관리 페이지</b>에서는 룸메이트 목록과 초대 중인 룸메이트 목록을 확인할 수 있으며, 룸메이트의 프로필을 확인할 수 있다.
![슬라이드5](https://user-images.githubusercontent.com/71166763/158220174-5091cdaf-90d7-4f98-b4f5-f9ef69fa70b3.PNG)


### 5. 🚪 집 등록 / 노크하기
집이 없는 상태라면 집을 새로 만들거나 기존의 집에 들어갈 수 있다.  
집을 직접 만들거나, 초대링크를 통해 노크하거나, 직접 집을 검색해 노크할 수 있다.  
집안 구성원이 노크 수락 버튼을 누른다면 집에 들어갈 수 있다.  
  
![슬라이드7](https://user-images.githubusercontent.com/71166763/158220229-2334c814-058e-4178-a072-fd1f32b52fdc.PNG)  


### 6. 👤 My Page
<b>마이페이지</b>에서는 회원 정보 수정 및 탈퇴할 수 있으며 이전 집 기록을 볼 수 있고, 이전 집의 생활 수칙을 현재 집으로 가져올 수 있으며, 이사가기를 통해 집에서 나올 수 있다.
![슬라이드6](https://user-images.githubusercontent.com/71166763/158220218-8592e61d-7f4c-4980-8860-ea16da3c7534.PNG)

### 7. 👣 Sign Up & Sign In
<b>로그인 & 회원가입 페이지.</b> 현재 구글과 네이버 소셜 로그인이 가능하다.
  
![슬라이드8](https://user-images.githubusercontent.com/71166763/158220287-05b1494b-144e-4c09-bef6-cd254ac58742.PNG)
