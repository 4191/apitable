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

import { UserSpaceLabsFeatureVo } from '../models/UserSpaceLabsFeatureVo';
import { HttpFile } from '../http/http';

export class ResponseDataUserSpaceLabsFeatureVo {
    'success'?: boolean;
    'code'?: number;
    'message'?: string;
    'data'?: UserSpaceLabsFeatureVo;

    static readonly discriminator: string | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "success",
            "baseName": "success",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "code",
            "baseName": "code",
            "type": "number",
            "format": "int32"
        },
        {
            "name": "message",
            "baseName": "message",
            "type": "string",
            "format": ""
        },
        {
            "name": "data",
            "baseName": "data",
            "type": "UserSpaceLabsFeatureVo",
            "format": ""
        }    ];

    static getAttributeTypeMap() {
        return ResponseDataUserSpaceLabsFeatureVo.attributeTypeMap;
    }

    public constructor() {
    }
}

