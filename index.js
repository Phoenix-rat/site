var app = require('express')();
var fetchh = require('node-fetch');
////////////////////////----------------------\\\\\\\\\\\\\\\\\\\\\\\\\
var lanyard = 'https://api.lanyard.rest/v1/users/785054250677960737';
var github = 'https://api.github.com/users/phoenix-rat';
var repos = 'https://api.github.com/users/phoenix-rat/repos';
var port = {
    port: 3000
};
////////////////////////----------------------\\\\\\\\\\\\\\\\\\\\\\\\\
app.set('view engine', 'ejs');
app.set('views', process.cwd() + '/src');
////////////////////////----------------------\\\\\\\\\\\\\\\\\\\\\\\\\
var checkSpotify;
var spotify;
var user;
var activity;
var assets;
var appid;
var device;
var checkActivities;
////////////////////////----------------------\\\\\\\\\\\\\\\\\\\\\\\\\
app.get("/redirect/:name", function (req, res) {
    if (req.params.name === "discord") {
        res.redirect("https://discord.com/users/785054250677960737");
    }
    if (req.params.name === "youtube") {
        res.redirect("https://youtube.com/");
    }
    if (req.params.name === "github") {
        res.redirect("https://github.com/phoenix-rat");
    }
    if (req.params.name === "org") {
        res.redirect("https://github.com/prismadevelopment");
    }
    if (req.params.name === "repo") {
        res.redirect("https://github.com/phoenix-rat/site");
    }
    if (!req.params.name) {
        res.send("Redirect failed");
    }
    if (req.params.name === "spotify") {
        res.redirect("https://open.spotify.com/user/cagan-ayin");
    }
    else {
        res.redirect(req.params.name);
    }
});
app.get("/", function (req, res) {
    fetchh(lanyard).then(function (json) { return json.json(); }).then(function (result) {
        checkActivities = JSON.stringify(result.data.activities) === "[]"; //boolean
        checkSpotify = result.data.listening_to_spotify; //boolean
        spotify = checkSpotify ? result.data.spotify : false;
        user = {
            username: result.data.discord_user.username,
            public_flags: result.data.discord_user.public_flags,
            id: result.data.discord_user.id,
            tag: result.data.discord_user.discriminator,
            avatar: result.data.discord_user.avatar,
            avatarURL: "https://cdn.discordapp.com/avatars/".concat(result.data.discord_user.id, "/").concat(result.data.discord_user.avatar, ".webp"),
            status: result.data.discord_status
        }; //user
        activity = {
            start: checkActivities ? null : result.data.activities[0].timestamps.start,
            text1: checkActivities ? null : result.data.activities[0].name,
            text2: checkActivities ? null : result.data.activities[0].details,
            text3: checkActivities ? null : result.data.activities[0].state
        }; //activity
        assets = {
            small: {
                text: checkActivities ? null : result.data.activities[0].assets.small_text,
                image: checkActivities ? null : result.data.activities[0].assets.small_image
            },
            large: {
                text: checkActivities ? null : result.data.activities[0].assets.large_text,
                image: checkActivities ? null : result.data.activities[0].assets.large_image
            } //large
        }; //assets
        appid = checkActivities ? null : result.data.activities[0].application_id; //number
        device = {
            mobile: result.data.active_on_discord_mobile,
            pc: result.data.active_on_discord_desktop
        }; //device
    }); //lanyard-fetchh
    ////////////////////////----------------------\\\\\\\\\\\\\\\\\\\\\\\\\
    var githubUser;
    var githubRepos;
    ////////////////////////----------------------\\\\\\\\\\\\\\\\\\\\\\\\\
    fetchh(github).then(function (json) { return json.json(); }).then(function (result) {
        githubUser = {
            username: result.name,
            nickname: result.login,
            avatar: result.avatar_url,
            url: result.html_url,
            website: result.blog,
            location: result.location,
            bio: result.bio,
            repos: result.public_repos,
            gists: result.public_gists,
            followers: result.followers,
            following: result.following //number
        }; //githubUser
    }); //github-fetchh
    res.render('index', { checkSpotify: checkSpotify, checkActivities: checkActivities, spotify: spotify, user: user, activity: activity, assets: assets, appid: appid, device: device, githubUser: githubUser, githubRepos: githubRepos });
}); //get()
app.get("/css", function (req, res) {
    res.sendFile(process.cwd() + '/src/assets/css/style.css');
});
app.listen(port.port, function () {
    console.log('📀 Successfully connected to the website');
});
////////////////////////----------------------\\\\\\\\\\\\\\\\\\\\\\\\\
