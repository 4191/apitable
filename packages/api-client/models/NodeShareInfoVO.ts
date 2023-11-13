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

import { NodeShareTree } from '../models/NodeShareTree';
import { HttpFile } from '../http/http';

/**
* Node share information view
*/
export class NodeShareInfoVO {
    /**
    * Share Unique ID
    */
    'shareId'?: string;
    /**
    * Space ID
    */
    'spaceId'?: string;
    /**
    * Space name
    */
    'spaceName'?: string;
    'shareNodeTree'?: NodeShareTree;
    /**
    * Allow others to deposit
    */
    'allowSaved'?: boolean;
    /**
    * Allow others to edit
    */
    'allowEdit'?: boolean;
    /**
    * Whether to allow others to apply for joining the space
    */
    'allowApply'?: boolean;
    /**
    * Whether to allow others to copy data outside the station
    */
    'allowCopyDataToExternal'?: boolean;
    /**
    * Allow others to download attachments
    */
    'allowDownloadAttachment'?: boolean;
    /**
    * Last Modified By
    */
    'lastModifiedBy'?: string;
    /**
    * Head portrait address
    */
    'lastModifiedAvatar'?: string;
    /**
    * Login or not
    */
    'hasLogin'?: boolean;
    /**
    * Whether to open「View manual save」Experimental function
    */
    'featureViewManualSave'?: boolean;
    /**
    * is deleted
    */
    'isDeleted'?: boolean;

    static readonly discriminator: string | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "shareId",
            "baseName": "shareId",
            "type": "string",
            "format": ""
        },
        {
            "name": "spaceId",
            "baseName": "spaceId",
            "type": "string",
            "format": ""
        },
        {
            "name": "spaceName",
            "baseName": "spaceName",
            "type": "string",
            "format": ""
        },
        {
            "name": "shareNodeTree",
            "baseName": "shareNodeTree",
            "type": "NodeShareTree",
            "format": ""
        },
        {
            "name": "allowSaved",
            "baseName": "allowSaved",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "allowEdit",
            "baseName": "allowEdit",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "allowApply",
            "baseName": "allowApply",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "allowCopyDataToExternal",
            "baseName": "allowCopyDataToExternal",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "allowDownloadAttachment",
            "baseName": "allowDownloadAttachment",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "lastModifiedBy",
            "baseName": "lastModifiedBy",
            "type": "string",
            "format": ""
        },
        {
            "name": "lastModifiedAvatar",
            "baseName": "lastModifiedAvatar",
            "type": "string",
            "format": ""
        },
        {
            "name": "hasLogin",
            "baseName": "hasLogin",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "featureViewManualSave",
            "baseName": "featureViewManualSave",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "isDeleted",
            "baseName": "isDeleted",
            "type": "boolean",
            "format": ""
        }    ];

    static getAttributeTypeMap() {
        return NodeShareInfoVO.attributeTypeMap;
    }

    public constructor() {
    }
}
