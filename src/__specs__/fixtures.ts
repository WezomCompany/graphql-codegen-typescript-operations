export const fixtures: {
	name: string;
	operationSource: string;
	operationExpectedResult: string;
	enumsExpectedResult: string;
}[] = [
	{
		name: 'extracts enums: `Role` and `Unused`',
		operationSource: `
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never }
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  { string; string; }
  { string; string; }
  { boolean; boolean; }
  { number; number; }
  { number; number; }
  { any; any; }
}

export enum Unused {
  Bar = 'BAR',
  Foo = 'FOO'
}

export interface CredentialInput {
  Scalars['String']['input'];
  Scalars['String']['input'];
}

export enum Role {
  Admin = 'ADMIN',
  User = 'USER'
}

export type FindUserQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type FindUserQuery = { __typename?: 'Query', user?: { __typename?: 'User', id: string, username: string, role: Role } | null };

export type UserFieldsFragment = { __typename?: 'User', id: string, username: string, role: Role };

`,
		operationExpectedResult: `
import type { Role, Unused } from './enums';

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never }
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  { string; string; }
  { string; string; }
  { boolean; boolean; }
  { number; number; }
  { number; number; }
  { any; any; }
}



export interface CredentialInput {
  Scalars['String']['input'];
  Scalars['String']['input'];
}



export type FindUserQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type FindUserQuery = { __typename?: 'Query', user?: { __typename?: 'User', id: string, username: string, role: Role } | null };

export type UserFieldsFragment = { __typename?: 'User', id: string, username: string, role: Role };
`,
		enumsExpectedResult: `export enum Role {
  Admin = 'ADMIN',
  User = 'USER'
}

export enum Unused {
  Bar = 'BAR',
  Foo = 'FOO'
}`,
	},
];
