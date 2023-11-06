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
* migration resources request param
*/
export class MigrationResourcesRo {
    /**
    * Auth Token
    */
    'token': string;
    /**
    * sourceBucket
    */
    'sourceBucket': string;
    /**
    * targetBucket
    */
    'targetBucket': string;
    /**
    * resourceKeys
    */
    'resourceKeys': Array<string>;

    static readonly discriminator: string | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "token",
            "baseName": "token",
            "type": "string",
            "format": ""
        },
        {
            "name": "sourceBucket",
            "baseName": "sourceBucket",
            "type": "string",
            "format": ""
        },
        {
            "name": "targetBucket",
            "baseName": "targetBucket",
            "type": "string",
            "format": ""
        },
        {
            "name": "resourceKeys",
            "baseName": "resourceKeys",
            "type": "Array<string>",
            "format": ""
        }    ];

    static getAttributeTypeMap() {
        return MigrationResourcesRo.attributeTypeMap;
    }

    public constructor() {
    }
}

