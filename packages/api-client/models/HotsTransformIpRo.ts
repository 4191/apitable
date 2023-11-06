/**
 * Api Document
 * Backend_Server Api Document
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { HttpFile } from '../http/http';

/**
* Domain name conversion IP request parameters
*/
export class HotsTransformIpRo {
    /**
    * Domain name
    */
    'domain': string;

    static readonly discriminator: string | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "domain",
            "baseName": "domain",
            "type": "string",
            "format": ""
        }    ];

    static getAttributeTypeMap() {
        return HotsTransformIpRo.attributeTypeMap;
    }

    public constructor() {
    }
}

