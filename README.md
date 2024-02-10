# PtoP

Website Link : https://peer2perer.social

### Problem trying to solve
Competitive programming plays key role in increasing problem solving abilities and knowledge on Data structure and algorithms among participants. After giving contest many of the participants in the contest want to discuss with others but other than codeforces comment section there is no other place where they can discuss.

### Solution camme up with
Discussion on codeforces comment section is also not that efficient way of sharing ideas compared to real time discussion through audio and video. So our idea is to build a real time discussion platform. And we have extended this idea to other competitive exams like JEE, CAT, GATE by creating a common examination on the platform.

### Detailing
<ul>
<li>We restricted to codeforces and JEE for this prototype and can be easily expanded to other sections</li>
<img style="border:solid 3px" width="1000" alt="home" src="https://user-images.githubusercontent.com/74662593/208660121-166cc810-d07d-472b-9a54-019459b8cf0a.png">
<img width="1440" alt="login" src="https://user-images.githubusercontent.com/74662593/208661552-102af06e-3e20-47be-a921-0d28cdcdbe20.png">

 <li> Users will be able to register with their username(unique),email(unique) and password to the website and registered users will be redirected to the dashboard page.
  </li>
  <ul>
  <li>For codeforces section users will get authenticated with their handles</li>
  </ul>
 <li>
  In the dashboard page there will be a list of events will be displayed along with their respective start times.There are two types of events
<img style="border:solid 3px" width="1000" alt="discussion" src="https://user-images.githubusercontent.com/74662593/208660179-4d89587a-e9a3-467e-832e-4d69335130be.png">
<img style="border:solid 3px" width="1000" alt="events2" src="https://user-images.githubusercontent.com/74662593/208660280-223530cf-1cad-4c4f-8134-9e67707e0315.png">
<img style="border:solid 3px" width="1000" alt="events3" src="https://user-images.githubusercontent.com/74662593/208660293-79b7a00d-7f36-4832-ba59-dcad41daeded.png">
    <ul>
    <li>Events are created by the admins</li>
    <li>Discussion Event</li>
    <ul>
    <li>This event is to have discussion among peers</li>
    <li>Discussion events are based on exam/contests. For competitve prgramming sections, there will be already contests on various platforms like codeforces, codechef, atcoder we will be allowing participants who participated in the correspoding contest event to register and participate in the discussion</li>
    </ul>
    <li>Exam Event</li>
    <ul>
    <li>For contest discssion there is already a common contest on competitive programming platforms. But for other sections like JEE, CAT, GATE there will be no common exam for all the participants. So we have implemented exam portal where we keep a common exam for each section and followed by its discussion event </li>
    ![alt text]("https://github.com/Sanath91009/GrowTogether/tree/main/source/frontend/src/images/readmeImages/exam1.png?raw=true" style="border:solid 5px" />
    ![alt text]("https://github.com/Sanath91009/GrowTogether/tree/main/source/frontend/src/images/readmeImages/results.png?raw=true" style="border:solid 5px" />
    </ul>
    </ul>
 </li>
 <li>
   Now the Users will select the particular event and click on register for the event.Users should register before the event start time.
 </li>
  <li>
    After the event started, user can join the event, if it is a exam event they will be redirected to eaxm portal where the exam takes place, if it is a discusion event then it will be redirected to Global room.
  </li>
  <li>
    Here global room consists of all the users who have registered for that event with their username and score of its corresponding contest/exam.
    <figure>
<img style="border:solid 3px" width="1000" alt="Groom" src="https://user-images.githubusercontent.com/74662593/208660385-cd0cf98d-9c0c-4167-9e34-29b7fa380fa5.png">
    <figcaption>user vivek1 sent request to adarsh1</figcaption>
    </figure>
        <figure>
<img style="border:solid 3px" width="1000" alt="AdarshGroom" src="https://user-images.githubusercontent.com/74662593/208660365-cb092a20-261a-4f1c-bcb9-6beceef88efd.png">
    <figcaption>adarsh will be receiving the request in real time</figcaption>
    </figure>
  </li>
  <li>
    Users can click on request on any of the users profile if he/she wants to discuss about the contest/exam with that user.
  </li>
  <li>
    Also in global room the user can see the requests that other users made for him inorder to join the post contest/discussion with him. This works in real time where we have used web sockets (socket.io) library to handle the communication instead of HTTP request/response. 
  </li>
  <li>
    Now the user can accept any one of the request he/she received and both of the users will be given a unique link where they can do post contest/exam discussion through live video stream which we have implemented using peer.js/webrtc library.
  </li>
  <li> User can start random pairing option which randomly pairs with other registered user who are also started random pairing on there side.</li>
        <figure>
<img style="border:solid 3px" width="1000" alt="roomLink" src="https://user-images.githubusercontent.com/74662593/208660367-ef3e4758-bd41-4511-bfad-3ace0eaf2deb.png">
    <figcaption>vivek1 got the request</figcaption>
    </figure>
    <li>Request sending, request recieving, room link sending , room link recieving are all real time communications</li>
        <figure>
<img style="border:solid 3px" width="1000" alt="Proom" src="https://user-images.githubusercontent.com/74662593/208660395-8b950ef9-7b68-42da-b2c5-7635e9e85285.png">
    <figcaption>Both joined in a room (since it is not depolyed yet, both are running in the same machine, so both have same images)</figcaption>
    </figure>    
</ul>


### Techstack
<ul>
<li>Frontend : Reactjs</li>
<li>Backend  : Nodejs</li>
<li>Database : MongoDB Atlas</li>
</ul>
