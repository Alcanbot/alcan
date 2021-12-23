/* eslint-disable camelcase */
import FluorineClient from '@classes/Client';
import axios from 'axios';
export default class OAuthHandler {
    scopes: string[];
    client: FluorineClient;
    constructor(client: FluorineClient, scopes: string[]) {
        this.scopes = scopes;
        this.client = client;
    }
    async getToken(code: string) {
        const returned = await axios
            .post(
                'https://discord.com/api/oauth2/token',
                new URLSearchParams({
                    client_id: this.client.user.id,
                    client_secret: this.client.config.secret,
                    grant_type: 'authorization_code',
                    code,
                    scope: this.scopes.join(),
                    redirect_uri: this.client.config.redirect_uri
                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            )
            .catch(e => {
                console.log(e);
            });
        // @ts-ignore
        return returned?.data;
    }
    async getUser(token: string) {
        const returned = await axios.get('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return returned?.data;
    }
    async getGuilds(token: string) {
        const returned = await axios.get(
            'https://discord.com/api/users/@me/guilds',
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return returned?.data;
    }
    async refreshToken(refresh_token: string) {
        const returned = await axios
            .post(
                'https://discord.com/api/oauth2/token',
                new URLSearchParams({
                    client_id: this.client.user.id,
                    client_secret: this.client.config.secret,
                    grant_type: 'refresh_token',
                    refresh_token
                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            )
            .catch(e => {
                console.log(e);
            });
        // @ts-ignore
        return returned?.data;
    }
}