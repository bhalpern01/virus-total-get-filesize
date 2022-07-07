const { default: axios } = require('axios');
require('dotenv').config();

module.exports = class VirusTotalFileSizeService {

    /**
     * Get the "size" attribute for a single attack file
     * The URL and API Key are read from the ".env" config file.
     * 
     * If for any reason there's no valid "size", set it to undefined for consistency
     * 
     * @param md5Hash 
     * @returns Promise<{ md5, size }>
     */
    static async getFileSize(md5Hash) {
        try {
            return axios.get(`${process.env.API_URL_BASE}${md5Hash}`,
            { headers: { "x-apikey": process.env.API_KEY } })
            .then(response => {
                return {
                    md5: md5Hash,
                    size: response?.data?.data?.attributes?.size
                }
            }).catch(e => {
                console.log(`getFileSize() API error: ${e}`);
                return {
                    md5: md5Hash,
                    size: undefined
                }
            });
        } catch (e) {
            console.log(`getFileSize() error: ${e}`);
            return {
                md5: md5Hash,
                size: undefined
            }
        }
    }

    /**
     * Get the "size" attribute for all of the files at the same time
     * Hopefully this won't break the API's restriction on number of calls per hour
     * 
     * @param malwareFiles 
     * @returns Promise<{ md5, size }[]>
     */
    static async getFileSizes(malwareFiles) {
        return Promise.all(
            malwareFiles.map(file => {
                return this.getFileSize(file.md5);
            })
        );
    }
}