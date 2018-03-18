# Is There School
(based on - Actions on Google API.AI Boilerplate)


<a href="https://glitch.com/~actions-on-google-api-ai-boilerplate">
  <img src="https://cdn.rawgit.com/j-f1/nails-example/f97c8590/glitch-badge.svg" alt="Remix on Glitch">
</a>

This code will act as the [webhook fulfillment](https://docs.api.ai/docs/webhook) endpoint for a [DialogFlow](https://console.dialogflow.com) 

Currently this project will return the status (open or closed) for a single school, to Google Home if you say *"ok google ask Is There School"* it will return "open" or "closed"

It could be expanded to take parameters like the school name and location.
It would need a lookup table for each school to find a URL and a function that could be used against that URL to return the data element giving the schools status. E.g.

<table>
<tr><td>Location1</td><td>School1</td><td>https://url1/page1.html</td><td> get_status_location1_school(school1)</td></tr>
<tr><td>Location1</td><td>School2</td><td>https://url1/page1.html</td><td>get_status_location1_school(school2)</td></tr>
<tr><td>Location2</td><td>School1</td><td>https://url2/page2.html</td><td>get_status_location2_school(school1)</td></tr>
</table>

[Work Flow](https://drive.google.com/file/d/1nB9Ej2tU7lEbJvR39t49EQjLhnO6b0tg/view?usp=sharing)

[About Glitch](https://glitch.com/about)

## Project

On the back-end,
- The app starts at `server.js`
- frameworks and packages in `package.json`
- safely store app secrets in `.env`
- safely store data secrets in `.data`

On the front-end,
- edit `client.js`, `style.css` and `index.html`
- drag in `assets`, like images or music, to add them to your project

## Getting Started

* [Create an agent on API.ai.](https://developers.google.com/actions/apiai/tutorials/google-facts)
* [Enable webhook fulfillment.](https://docs.api.ai/docs/webhook)
* [Enable the Google Assistant integration to test your app.](https://developers.google.com/actions/apiai/submit-app#test_your_app_in_the_actions_simulator)

## Contributing

## Credits

This project was made by possible by the [boilerplate](https://glitch.com/~actions-on-google-api-ai-boilerplate) project from [Voxable](https://voxable.io), a boutique conversational interface agency in Austin, Texas. It's based [on another Glitch boilerplate provided by the Glitch team](https://glitch.com/~google-home). 

Voxable builds chatbots, voice interface, Alexa skills, and Google Assistant apps for products and clients. Voxable's goal is to help humans and machines better understand each other.

<a href="https://voxable.io"><img title="Voxable logo" src="https://cdn.glitch.com/216ad9f8-8b2b-4a63-b11a-675087c02c37%2Fvoxable-logo.png?1495696923680" /></a>

Actions on Google and Google Assistant are property of Google, Inc. and are for identification purposes only. Use of these names does not imply endorsement.
