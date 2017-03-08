Meteor.startup(() => {
    ServiceConfiguration.configurations.remove({
        service: "facebook"
    });
    ServiceConfiguration.configurations.insert({
        service: "facebook",
        appId: '258641021230701',
        loginStyle: "popup",
        secret: 'bde18be4485e55b35713264905edb4f1'
    });
});