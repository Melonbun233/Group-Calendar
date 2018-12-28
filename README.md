# Group Calendar
This project is an ios app that aims to help small group (10-20) to arrange and decide meeting time.  
This app is developed during CPEN-321 (Software Engineering) at UBC.

## Project Details
### Architecture Diagram
![arch_new](https://user-images.githubusercontent.com/22037146/50525793-943c6600-0a92-11e9-87e3-8b37e663e1f3.png)
### Architecture Patterns
* Overall pattern: Client-server
We choose client-server pattern for overall project architecture because we want to handle all requests on our server so that unauthorized user cannot damage the system. Also, it’s easy to maintain all services and data on the server.
* Client pattern: MVC (Model-View-Controller)
We choose MVC because it has a fast development process because model, view and controller modules are seperated. Meanwhile, few modifications won’t affect the overall design of the client design.
* Server pattern: Layered architecture
Using layered architecture, upper layer has to request lower layer to access information from the database layer below the lower layer, in which way database can be protected from unexpected access.
* Services Layer
We used monolith instead of microservices because our app is relatively small in functionalities and users comparing to Amazon or Netflix who use microservices, thus using monolith would make our deployment easier.
* Data Layer
Different service can access same databases, since each service has difference request to the database, directly accessing database would make implementation easier for the scope of our app. 

### Use Case Diagram
<img width="609" alt="screen shot 2018-12-28 at 11 18 43" src="https://user-images.githubusercontent.com/22037146/50525887-352b2100-0a93-11e9-8432-0f0323f89e98.png">

### Non-functional Requirements
* Security
```
Users’ information is encrypted when it transfers between clients and the server.
All databases only accept connection from the local host and system owner’s ip address.
All input or queries will be verified before enter databases to prevent SQL injections.
Users will be automatically logged out if they haven’t open the application for 2 weeks.
Use cookie to authenticate clients.
```
* User Interface
```
UI only has three main pages (profile, calendar, project) so that users can easily use the application without a high learning curve.
UI (button size, button color, main scheme) should keep the same design.
```
* Notifications
```
Only keep necessary information on the notification so that users can get the important information without opening the application.
Users can decide which kind of notifications (upcoming events, new comment, new assignment) to be pushed.
Notifications should be pushed immediately once changes have been made.
```
* Performance
```
The application should be able to open in 1 second.
Tasks will be assigned immediately to every team member after everyone has confirmed their tasks.
```
* Test
```
Achieve at least 90% lines coverage.
Use Detox for automated GUI test.
```


## Screen Shots
<img width="250" alt="screen shot 2018-12-28 at 11 09 03" src="https://user-images.githubusercontent.com/22037146/50525578-2c395000-0a91-11e9-9995-2a0ee3cb40de.png"><img width="250" alt="screen shot 2018-12-28 at 11 09 20" src="https://user-images.githubusercontent.com/22037146/50525586-34918b00-0a91-11e9-8d41-25b61c875cfe.png"><img width="250" alt="screen shot 2018-12-28 at 11 09 25" src="https://user-images.githubusercontent.com/22037146/50525588-35c2b800-0a91-11e9-946f-1ea5e96b240a.png"><img width="250" alt="screen shot 2018-12-28 at 11 13 40" src="https://user-images.githubusercontent.com/22037146/50525651-aec20f80-0a91-11e9-86f9-f9950c22fae7.png"><img width="250" alt="screen shot 2018-12-28 at 11 09 30" src="https://user-images.githubusercontent.com/22037146/50525591-39563f00-0a91-11e9-812d-06d0c67335ae.png"><img width="250" alt="screen shot 2018-12-28 at 11 09 32" src="https://user-images.githubusercontent.com/22037146/50525594-39eed580-0a91-11e9-9c82-918d81abeda4.png">

