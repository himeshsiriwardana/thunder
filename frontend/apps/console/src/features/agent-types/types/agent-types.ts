/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import type {ApiPaginationLink} from '@thunderid/types';

/**
 * TypeScript types and interfaces for Agent Types feature
 * Based on the OpenAPI specification for AgentType endpoints
 */

/**
 * Base property definition types for agent type
 */
interface BasePropertyDefinition {
  required?: boolean;
  unique?: boolean;
  displayName?: string;
}

/**
 * String property definition
 */
export interface StringPropertyDefinition extends BasePropertyDefinition {
  type: 'string';
  credential?: boolean;
  enum?: string[];
  regex?: string;
}

/**
 * Number property definition
 */
export interface NumberPropertyDefinition extends BasePropertyDefinition {
  type: 'number';
  credential?: boolean;
}

/**
 * Boolean property definition
 */
export interface BooleanPropertyDefinition extends BasePropertyDefinition {
  type: 'boolean';
}

/**
 * Object property definition with nested properties
 */
export interface ObjectPropertyDefinition extends BasePropertyDefinition {
  type: 'object';
  properties: Record<string, PropertyDefinition>;
}

/**
 * Array item definition (can be primitive or object)
 */
export type ArrayItemDefinition =
  | {
      type: 'string' | 'number' | 'boolean';
      enum?: string[];
    }
  | {
      type: 'object';
      properties: Record<string, PropertyDefinition>;
    };

/**
 * Array property definition
 */
export interface ArrayPropertyDefinition extends BasePropertyDefinition {
  type: 'array';
  items: ArrayItemDefinition;
}

/**
 * Discriminated union of all property definition types
 */
export type PropertyDefinition =
  | StringPropertyDefinition
  | NumberPropertyDefinition
  | BooleanPropertyDefinition
  | ObjectPropertyDefinition
  | ArrayPropertyDefinition;

/**
 * User type schema definition (key-value pairs of property definitions)
 */
export type AgentTypeDefinition = Record<string, PropertyDefinition>;

/**
 * System-level metadata for a agent type.
 */
export interface SystemAttributes {
  display?: string;
}

/**
 * Complete Agent Type object as returned by API
 */
export interface ApiAgentType {
  id: string;
  name: string;
  ouId: string;
  ouHandle?: string;
  systemAttributes?: SystemAttributes;
  schema: AgentTypeDefinition;
}

/**
 * Agent Type list item (minimal representation)
 */
export interface AgentTypeListItem {
  id: string;
  name: string;
  ouId: string;
  ouHandle?: string;
  systemAttributes?: SystemAttributes;
}

/**
 * Response for GET /agent-types (list with pagination)
 */
export interface AgentTypeListResponse {
  totalResults: number;
  startIndex: number;
  count: number;
  schemas: AgentTypeListItem[];
  links?: ApiPaginationLink[];
}

/**
 * Request body for PUT /agent-types/{id} (update)
 */
export interface UpdateAgentTypeRequest {
  name: string;
  ouId: string;
  systemAttributes?: SystemAttributes;
  schema: AgentTypeDefinition;
}

/**
 * Query parameters for listing agent types
 */
export interface AgentTypeListParams {
  limit?: number;
  offset?: number;
}

/**
 * Property type union for form inputs
 */
export type PropertyType = 'string' | 'number' | 'boolean' | 'array' | 'object';

/**
 * UI property type including 'enum' as a separate option (maps to string with enum values)
 */
export type UIPropertyType = PropertyType | 'enum';

/**
 * Schema property input type for create/edit forms
 */
export interface SchemaPropertyInput {
  id: string;
  name: string;
  displayName: string;
  type: UIPropertyType;
  required: boolean;
  unique: boolean;
  credential: boolean;
  enum: string[];
  regex: string;
  /** Preserved array item definition for round-trip fidelity. */
  items?: ArrayItemDefinition;
  /** Preserved nested object properties for round-trip fidelity. */
  properties?: Record<string, PropertyDefinition>;
}
