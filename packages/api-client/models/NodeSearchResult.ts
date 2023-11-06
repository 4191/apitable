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

import { NodePermissionView } from '../models/NodePermissionView';
import { HttpFile } from '../http/http';

/**
* Node Search Results
*/
export class NodeSearchResult {
    /**
    * Node ID
    */
    'nodeId'?: string;
    /**
    * Node Name
    */
    'nodeName'?: string;
    /**
    * Node Type 0-ROOT（Root node） 1-folder（Folder） 2-file（Datasheet）
    */
    'type'?: number;
    /**
    * Space ID
    */
    'spaceId'?: string;
    /**
    * Parent Node Id
    */
    'parentId'?: string;
    /**
    * Previous node ID
    */
    'preNodeId'?: string;
    /**
    * Node icon
    */
    'icon'?: string;
    /**
    * Whether there are sub nodes. The node type is folder
    */
    'hasChildren'?: boolean;
    /**
    * Whether the node is shared
    */
    'nodeShared'?: boolean;
    /**
    * Whether the node permission is set
    */
    'nodePermitSet'?: boolean;
    /**
    * Whether the node is a star
    */
    'nodeFavorite'?: boolean;
    /**
    * When the node is a data table, whether the returned data table field has reached the upper limit
    */
    'columnLimit'?: boolean;
    /**
    * Create time
    */
    'createTime'?: string;
    /**
    * Update time
    */
    'updateTime'?: string;
    /**
    * Role
    */
    'role'?: string;
    'permissions'?: NodePermissionView;
    /**
    * Parent Path
    */
    'superiorPath'?: string;

    static readonly discriminator: string | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "nodeId",
            "baseName": "nodeId",
            "type": "string",
            "format": ""
        },
        {
            "name": "nodeName",
            "baseName": "nodeName",
            "type": "string",
            "format": ""
        },
        {
            "name": "type",
            "baseName": "type",
            "type": "number",
            "format": "int32"
        },
        {
            "name": "spaceId",
            "baseName": "spaceId",
            "type": "string",
            "format": ""
        },
        {
            "name": "parentId",
            "baseName": "parentId",
            "type": "string",
            "format": ""
        },
        {
            "name": "preNodeId",
            "baseName": "preNodeId",
            "type": "string",
            "format": ""
        },
        {
            "name": "icon",
            "baseName": "icon",
            "type": "string",
            "format": ""
        },
        {
            "name": "hasChildren",
            "baseName": "hasChildren",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "nodeShared",
            "baseName": "nodeShared",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "nodePermitSet",
            "baseName": "nodePermitSet",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "nodeFavorite",
            "baseName": "nodeFavorite",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "columnLimit",
            "baseName": "columnLimit",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "createTime",
            "baseName": "createTime",
            "type": "string",
            "format": ""
        },
        {
            "name": "updateTime",
            "baseName": "updateTime",
            "type": "string",
            "format": ""
        },
        {
            "name": "role",
            "baseName": "role",
            "type": "string",
            "format": ""
        },
        {
            "name": "permissions",
            "baseName": "permissions",
            "type": "NodePermissionView",
            "format": ""
        },
        {
            "name": "superiorPath",
            "baseName": "superiorPath",
            "type": "string",
            "format": ""
        }    ];

    static getAttributeTypeMap() {
        return NodeSearchResult.attributeTypeMap;
    }

    public constructor() {
    }
}

