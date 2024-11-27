# To implement a workflow where:

* Person A (the applicant) submits an application.
* Person B (the approver) approves the application.
* Person A receives a notification that their application has been approved.

## We will need to:

### Track the status of the application.
* Emit notifications only to the relevant user (Person A).
* Use Socket.IO for real-time updates.

Here's how you can modify the previous code to implement this workflow.


## Key Points:
* Applications Storage: I’m using an in-memory array applications to store the application details (name, email, and status). In a real-world scenario, you'd store this in a database.

* Submit Application: When a user (Person A) submits an application, it's stored in the array, and a notification is sent to all clients to inform the approvers about the new application.

* Approve Application: When Person B (the approver) approves the application, a notification is sent only to Person A to let them know their application has been approved.

* Notifications: The server emits a notification with different message types (e.g., 'new-application', 'application-approved').


## Key Points:
* Real-time Notifications: The socket.on('notification', ...) listens for notifications emitted from the server.

* If a new application is submitted (type: 'new-application'), it will display the message in all clients (for approvers).

* If the application is approved (type: 'application-approved'), it checks if the email of the applicant matches the email of the connected user and displays the notification for the applicant only.

* Form Submission: The form uses JavaScript Fetch API to submit the form data to the server without a page refresh.

## Running the Application

## Start the server by running:

```
node server.js
```

## Open two different browser tabs or windows:

* Tab 1 (Person A): Submit an application by entering the name and email, and clicking Submit Application.

* Tab 2 (Person B): As the approver, you can approve the application by sending a POST request to /approve/:email, where :email is the email of Person A.

* For example, you could visit the following URL to approve the application:

POST request
```
http://localhost:3000/approve/persona@example.com
```

* Real-Time Notification: When Person B approves the application, Person A will receive the notification that their application was approved.

## Conclusion
### This updated implementation allows for a two-step process where:

* Person A submits an application.
* Person B approves it.
* Person A gets a real-time notification about the approval.

* The use of Socket.IO makes this system ideal for applications where real-time interaction is necessary, such as in workflows or approval processes.