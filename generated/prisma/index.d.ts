
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Follower
 * 
 */
export type Follower = $Result.DefaultSelection<Prisma.$FollowerPayload>
/**
 * Model Video
 * 
 */
export type Video = $Result.DefaultSelection<Prisma.$VideoPayload>
/**
 * Model VideoMetadata
 * 
 */
export type VideoMetadata = $Result.DefaultSelection<Prisma.$VideoMetadataPayload>
/**
 * Model Comment
 * 
 */
export type Comment = $Result.DefaultSelection<Prisma.$CommentPayload>
/**
 * Model Like
 * 
 */
export type Like = $Result.DefaultSelection<Prisma.$LikePayload>
/**
 * Model VideoView
 * 
 */
export type VideoView = $Result.DefaultSelection<Prisma.$VideoViewPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const VideoStatus: {
  processing: 'processing',
  ready: 'ready',
  error: 'error'
};

export type VideoStatus = (typeof VideoStatus)[keyof typeof VideoStatus]


export const VideoType: {
  standard: 'standard',
  teaser: 'teaser',
  premium: 'premium',
  vip: 'vip'
};

export type VideoType = (typeof VideoType)[keyof typeof VideoType]

}

export type VideoStatus = $Enums.VideoStatus

export const VideoStatus: typeof $Enums.VideoStatus

export type VideoType = $Enums.VideoType

export const VideoType: typeof $Enums.VideoType

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.follower`: Exposes CRUD operations for the **Follower** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Followers
    * const followers = await prisma.follower.findMany()
    * ```
    */
  get follower(): Prisma.FollowerDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.video`: Exposes CRUD operations for the **Video** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Videos
    * const videos = await prisma.video.findMany()
    * ```
    */
  get video(): Prisma.VideoDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.videoMetadata`: Exposes CRUD operations for the **VideoMetadata** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more VideoMetadata
    * const videoMetadata = await prisma.videoMetadata.findMany()
    * ```
    */
  get videoMetadata(): Prisma.VideoMetadataDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.comment`: Exposes CRUD operations for the **Comment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Comments
    * const comments = await prisma.comment.findMany()
    * ```
    */
  get comment(): Prisma.CommentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.like`: Exposes CRUD operations for the **Like** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Likes
    * const likes = await prisma.like.findMany()
    * ```
    */
  get like(): Prisma.LikeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.videoView`: Exposes CRUD operations for the **VideoView** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more VideoViews
    * const videoViews = await prisma.videoView.findMany()
    * ```
    */
  get videoView(): Prisma.VideoViewDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.8.2
   * Query Engine version: 2060c79ba17c6bb9f5823312b6f6b7f4a845738e
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Follower: 'Follower',
    Video: 'Video',
    VideoMetadata: 'VideoMetadata',
    Comment: 'Comment',
    Like: 'Like',
    VideoView: 'VideoView'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "follower" | "video" | "videoMetadata" | "comment" | "like" | "videoView"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Follower: {
        payload: Prisma.$FollowerPayload<ExtArgs>
        fields: Prisma.FollowerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FollowerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FollowerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FollowerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FollowerPayload>
          }
          findFirst: {
            args: Prisma.FollowerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FollowerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FollowerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FollowerPayload>
          }
          findMany: {
            args: Prisma.FollowerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FollowerPayload>[]
          }
          create: {
            args: Prisma.FollowerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FollowerPayload>
          }
          createMany: {
            args: Prisma.FollowerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FollowerCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FollowerPayload>[]
          }
          delete: {
            args: Prisma.FollowerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FollowerPayload>
          }
          update: {
            args: Prisma.FollowerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FollowerPayload>
          }
          deleteMany: {
            args: Prisma.FollowerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FollowerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FollowerUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FollowerPayload>[]
          }
          upsert: {
            args: Prisma.FollowerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FollowerPayload>
          }
          aggregate: {
            args: Prisma.FollowerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFollower>
          }
          groupBy: {
            args: Prisma.FollowerGroupByArgs<ExtArgs>
            result: $Utils.Optional<FollowerGroupByOutputType>[]
          }
          count: {
            args: Prisma.FollowerCountArgs<ExtArgs>
            result: $Utils.Optional<FollowerCountAggregateOutputType> | number
          }
        }
      }
      Video: {
        payload: Prisma.$VideoPayload<ExtArgs>
        fields: Prisma.VideoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VideoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VideoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VideoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VideoPayload>
          }
          findFirst: {
            args: Prisma.VideoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VideoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VideoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VideoPayload>
          }
          findMany: {
            args: Prisma.VideoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VideoPayload>[]
          }
          create: {
            args: Prisma.VideoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VideoPayload>
          }
          createMany: {
            args: Prisma.VideoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VideoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VideoPayload>[]
          }
          delete: {
            args: Prisma.VideoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VideoPayload>
          }
          update: {
            args: Prisma.VideoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VideoPayload>
          }
          deleteMany: {
            args: Prisma.VideoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VideoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VideoUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VideoPayload>[]
          }
          upsert: {
            args: Prisma.VideoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VideoPayload>
          }
          aggregate: {
            args: Prisma.VideoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVideo>
          }
          groupBy: {
            args: Prisma.VideoGroupByArgs<ExtArgs>
            result: $Utils.Optional<VideoGroupByOutputType>[]
          }
          count: {
            args: Prisma.VideoCountArgs<ExtArgs>
            result: $Utils.Optional<VideoCountAggregateOutputType> | number
          }
        }
      }
      VideoMetadata: {
        payload: Prisma.$VideoMetadataPayload<ExtArgs>
        fields: Prisma.VideoMetadataFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VideoMetadataFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VideoMetadataPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VideoMetadataFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VideoMetadataPayload>
          }
          findFirst: {
            args: Prisma.VideoMetadataFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VideoMetadataPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VideoMetadataFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VideoMetadataPayload>
          }
          findMany: {
            args: Prisma.VideoMetadataFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VideoMetadataPayload>[]
          }
          create: {
            args: Prisma.VideoMetadataCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VideoMetadataPayload>
          }
          createMany: {
            args: Prisma.VideoMetadataCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VideoMetadataCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VideoMetadataPayload>[]
          }
          delete: {
            args: Prisma.VideoMetadataDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VideoMetadataPayload>
          }
          update: {
            args: Prisma.VideoMetadataUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VideoMetadataPayload>
          }
          deleteMany: {
            args: Prisma.VideoMetadataDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VideoMetadataUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VideoMetadataUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VideoMetadataPayload>[]
          }
          upsert: {
            args: Prisma.VideoMetadataUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VideoMetadataPayload>
          }
          aggregate: {
            args: Prisma.VideoMetadataAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVideoMetadata>
          }
          groupBy: {
            args: Prisma.VideoMetadataGroupByArgs<ExtArgs>
            result: $Utils.Optional<VideoMetadataGroupByOutputType>[]
          }
          count: {
            args: Prisma.VideoMetadataCountArgs<ExtArgs>
            result: $Utils.Optional<VideoMetadataCountAggregateOutputType> | number
          }
        }
      }
      Comment: {
        payload: Prisma.$CommentPayload<ExtArgs>
        fields: Prisma.CommentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CommentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CommentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          findFirst: {
            args: Prisma.CommentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CommentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          findMany: {
            args: Prisma.CommentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>[]
          }
          create: {
            args: Prisma.CommentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          createMany: {
            args: Prisma.CommentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CommentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>[]
          }
          delete: {
            args: Prisma.CommentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          update: {
            args: Prisma.CommentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          deleteMany: {
            args: Prisma.CommentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CommentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CommentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>[]
          }
          upsert: {
            args: Prisma.CommentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          aggregate: {
            args: Prisma.CommentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateComment>
          }
          groupBy: {
            args: Prisma.CommentGroupByArgs<ExtArgs>
            result: $Utils.Optional<CommentGroupByOutputType>[]
          }
          count: {
            args: Prisma.CommentCountArgs<ExtArgs>
            result: $Utils.Optional<CommentCountAggregateOutputType> | number
          }
        }
      }
      Like: {
        payload: Prisma.$LikePayload<ExtArgs>
        fields: Prisma.LikeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LikeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LikePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LikeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LikePayload>
          }
          findFirst: {
            args: Prisma.LikeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LikePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LikeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LikePayload>
          }
          findMany: {
            args: Prisma.LikeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LikePayload>[]
          }
          create: {
            args: Prisma.LikeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LikePayload>
          }
          createMany: {
            args: Prisma.LikeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LikeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LikePayload>[]
          }
          delete: {
            args: Prisma.LikeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LikePayload>
          }
          update: {
            args: Prisma.LikeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LikePayload>
          }
          deleteMany: {
            args: Prisma.LikeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LikeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LikeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LikePayload>[]
          }
          upsert: {
            args: Prisma.LikeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LikePayload>
          }
          aggregate: {
            args: Prisma.LikeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLike>
          }
          groupBy: {
            args: Prisma.LikeGroupByArgs<ExtArgs>
            result: $Utils.Optional<LikeGroupByOutputType>[]
          }
          count: {
            args: Prisma.LikeCountArgs<ExtArgs>
            result: $Utils.Optional<LikeCountAggregateOutputType> | number
          }
        }
      }
      VideoView: {
        payload: Prisma.$VideoViewPayload<ExtArgs>
        fields: Prisma.VideoViewFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VideoViewFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VideoViewPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VideoViewFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VideoViewPayload>
          }
          findFirst: {
            args: Prisma.VideoViewFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VideoViewPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VideoViewFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VideoViewPayload>
          }
          findMany: {
            args: Prisma.VideoViewFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VideoViewPayload>[]
          }
          create: {
            args: Prisma.VideoViewCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VideoViewPayload>
          }
          createMany: {
            args: Prisma.VideoViewCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VideoViewCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VideoViewPayload>[]
          }
          delete: {
            args: Prisma.VideoViewDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VideoViewPayload>
          }
          update: {
            args: Prisma.VideoViewUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VideoViewPayload>
          }
          deleteMany: {
            args: Prisma.VideoViewDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VideoViewUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VideoViewUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VideoViewPayload>[]
          }
          upsert: {
            args: Prisma.VideoViewUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VideoViewPayload>
          }
          aggregate: {
            args: Prisma.VideoViewAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVideoView>
          }
          groupBy: {
            args: Prisma.VideoViewGroupByArgs<ExtArgs>
            result: $Utils.Optional<VideoViewGroupByOutputType>[]
          }
          count: {
            args: Prisma.VideoViewCountArgs<ExtArgs>
            result: $Utils.Optional<VideoViewCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    follower?: FollowerOmit
    video?: VideoOmit
    videoMetadata?: VideoMetadataOmit
    comment?: CommentOmit
    like?: LikeOmit
    videoView?: VideoViewOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    videos: number
    comments: number
    likes: number
    videoViews: number
    followers: number
    following: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    videos?: boolean | UserCountOutputTypeCountVideosArgs
    comments?: boolean | UserCountOutputTypeCountCommentsArgs
    likes?: boolean | UserCountOutputTypeCountLikesArgs
    videoViews?: boolean | UserCountOutputTypeCountVideoViewsArgs
    followers?: boolean | UserCountOutputTypeCountFollowersArgs
    following?: boolean | UserCountOutputTypeCountFollowingArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountVideosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VideoWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCommentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommentWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountLikesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LikeWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountVideoViewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VideoViewWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountFollowersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FollowerWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountFollowingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FollowerWhereInput
  }


  /**
   * Count Type VideoCountOutputType
   */

  export type VideoCountOutputType = {
    comments: number
    likes: number
    views: number
  }

  export type VideoCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    comments?: boolean | VideoCountOutputTypeCountCommentsArgs
    likes?: boolean | VideoCountOutputTypeCountLikesArgs
    views?: boolean | VideoCountOutputTypeCountViewsArgs
  }

  // Custom InputTypes
  /**
   * VideoCountOutputType without action
   */
  export type VideoCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VideoCountOutputType
     */
    select?: VideoCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * VideoCountOutputType without action
   */
  export type VideoCountOutputTypeCountCommentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommentWhereInput
  }

  /**
   * VideoCountOutputType without action
   */
  export type VideoCountOutputTypeCountLikesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LikeWhereInput
  }

  /**
   * VideoCountOutputType without action
   */
  export type VideoCountOutputTypeCountViewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VideoViewWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    emailVerified: boolean | null
    name: string | null
    username: string | null
    bio: string | null
    profileImageUrl: string | null
    coverImageUrl: string | null
    isCreator: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    emailVerified: boolean | null
    name: string | null
    username: string | null
    bio: string | null
    profileImageUrl: string | null
    coverImageUrl: string | null
    isCreator: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    emailVerified: number
    name: number
    username: number
    bio: number
    profileImageUrl: number
    coverImageUrl: number
    isCreator: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    emailVerified?: true
    name?: true
    username?: true
    bio?: true
    profileImageUrl?: true
    coverImageUrl?: true
    isCreator?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    emailVerified?: true
    name?: true
    username?: true
    bio?: true
    profileImageUrl?: true
    coverImageUrl?: true
    isCreator?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    emailVerified?: true
    name?: true
    username?: true
    bio?: true
    profileImageUrl?: true
    coverImageUrl?: true
    isCreator?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    emailVerified: boolean
    name: string | null
    username: string | null
    bio: string | null
    profileImageUrl: string | null
    coverImageUrl: string | null
    isCreator: boolean
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    emailVerified?: boolean
    name?: boolean
    username?: boolean
    bio?: boolean
    profileImageUrl?: boolean
    coverImageUrl?: boolean
    isCreator?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    videos?: boolean | User$videosArgs<ExtArgs>
    comments?: boolean | User$commentsArgs<ExtArgs>
    likes?: boolean | User$likesArgs<ExtArgs>
    videoViews?: boolean | User$videoViewsArgs<ExtArgs>
    followers?: boolean | User$followersArgs<ExtArgs>
    following?: boolean | User$followingArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    emailVerified?: boolean
    name?: boolean
    username?: boolean
    bio?: boolean
    profileImageUrl?: boolean
    coverImageUrl?: boolean
    isCreator?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    emailVerified?: boolean
    name?: boolean
    username?: boolean
    bio?: boolean
    profileImageUrl?: boolean
    coverImageUrl?: boolean
    isCreator?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    emailVerified?: boolean
    name?: boolean
    username?: boolean
    bio?: boolean
    profileImageUrl?: boolean
    coverImageUrl?: boolean
    isCreator?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "emailVerified" | "name" | "username" | "bio" | "profileImageUrl" | "coverImageUrl" | "isCreator" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    videos?: boolean | User$videosArgs<ExtArgs>
    comments?: boolean | User$commentsArgs<ExtArgs>
    likes?: boolean | User$likesArgs<ExtArgs>
    videoViews?: boolean | User$videoViewsArgs<ExtArgs>
    followers?: boolean | User$followersArgs<ExtArgs>
    following?: boolean | User$followingArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      videos: Prisma.$VideoPayload<ExtArgs>[]
      comments: Prisma.$CommentPayload<ExtArgs>[]
      likes: Prisma.$LikePayload<ExtArgs>[]
      videoViews: Prisma.$VideoViewPayload<ExtArgs>[]
      followers: Prisma.$FollowerPayload<ExtArgs>[]
      following: Prisma.$FollowerPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      emailVerified: boolean
      name: string | null
      username: string | null
      bio: string | null
      profileImageUrl: string | null
      coverImageUrl: string | null
      isCreator: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    videos<T extends User$videosArgs<ExtArgs> = {}>(args?: Subset<T, User$videosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VideoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    comments<T extends User$commentsArgs<ExtArgs> = {}>(args?: Subset<T, User$commentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    likes<T extends User$likesArgs<ExtArgs> = {}>(args?: Subset<T, User$likesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LikePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    videoViews<T extends User$videoViewsArgs<ExtArgs> = {}>(args?: Subset<T, User$videoViewsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VideoViewPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    followers<T extends User$followersArgs<ExtArgs> = {}>(args?: Subset<T, User$followersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FollowerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    following<T extends User$followingArgs<ExtArgs> = {}>(args?: Subset<T, User$followingArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FollowerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly emailVerified: FieldRef<"User", 'Boolean'>
    readonly name: FieldRef<"User", 'String'>
    readonly username: FieldRef<"User", 'String'>
    readonly bio: FieldRef<"User", 'String'>
    readonly profileImageUrl: FieldRef<"User", 'String'>
    readonly coverImageUrl: FieldRef<"User", 'String'>
    readonly isCreator: FieldRef<"User", 'Boolean'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.videos
   */
  export type User$videosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Video
     */
    select?: VideoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Video
     */
    omit?: VideoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VideoInclude<ExtArgs> | null
    where?: VideoWhereInput
    orderBy?: VideoOrderByWithRelationInput | VideoOrderByWithRelationInput[]
    cursor?: VideoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: VideoScalarFieldEnum | VideoScalarFieldEnum[]
  }

  /**
   * User.comments
   */
  export type User$commentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    where?: CommentWhereInput
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    cursor?: CommentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * User.likes
   */
  export type User$likesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Like
     */
    select?: LikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Like
     */
    omit?: LikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikeInclude<ExtArgs> | null
    where?: LikeWhereInput
    orderBy?: LikeOrderByWithRelationInput | LikeOrderByWithRelationInput[]
    cursor?: LikeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LikeScalarFieldEnum | LikeScalarFieldEnum[]
  }

  /**
   * User.videoViews
   */
  export type User$videoViewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VideoView
     */
    select?: VideoViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VideoView
     */
    omit?: VideoViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VideoViewInclude<ExtArgs> | null
    where?: VideoViewWhereInput
    orderBy?: VideoViewOrderByWithRelationInput | VideoViewOrderByWithRelationInput[]
    cursor?: VideoViewWhereUniqueInput
    take?: number
    skip?: number
    distinct?: VideoViewScalarFieldEnum | VideoViewScalarFieldEnum[]
  }

  /**
   * User.followers
   */
  export type User$followersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Follower
     */
    select?: FollowerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Follower
     */
    omit?: FollowerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FollowerInclude<ExtArgs> | null
    where?: FollowerWhereInput
    orderBy?: FollowerOrderByWithRelationInput | FollowerOrderByWithRelationInput[]
    cursor?: FollowerWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FollowerScalarFieldEnum | FollowerScalarFieldEnum[]
  }

  /**
   * User.following
   */
  export type User$followingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Follower
     */
    select?: FollowerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Follower
     */
    omit?: FollowerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FollowerInclude<ExtArgs> | null
    where?: FollowerWhereInput
    orderBy?: FollowerOrderByWithRelationInput | FollowerOrderByWithRelationInput[]
    cursor?: FollowerWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FollowerScalarFieldEnum | FollowerScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Follower
   */

  export type AggregateFollower = {
    _count: FollowerCountAggregateOutputType | null
    _min: FollowerMinAggregateOutputType | null
    _max: FollowerMaxAggregateOutputType | null
  }

  export type FollowerMinAggregateOutputType = {
    id: string | null
    followerId: string | null
    followingId: string | null
    createdAt: Date | null
  }

  export type FollowerMaxAggregateOutputType = {
    id: string | null
    followerId: string | null
    followingId: string | null
    createdAt: Date | null
  }

  export type FollowerCountAggregateOutputType = {
    id: number
    followerId: number
    followingId: number
    createdAt: number
    _all: number
  }


  export type FollowerMinAggregateInputType = {
    id?: true
    followerId?: true
    followingId?: true
    createdAt?: true
  }

  export type FollowerMaxAggregateInputType = {
    id?: true
    followerId?: true
    followingId?: true
    createdAt?: true
  }

  export type FollowerCountAggregateInputType = {
    id?: true
    followerId?: true
    followingId?: true
    createdAt?: true
    _all?: true
  }

  export type FollowerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Follower to aggregate.
     */
    where?: FollowerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Followers to fetch.
     */
    orderBy?: FollowerOrderByWithRelationInput | FollowerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FollowerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Followers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Followers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Followers
    **/
    _count?: true | FollowerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FollowerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FollowerMaxAggregateInputType
  }

  export type GetFollowerAggregateType<T extends FollowerAggregateArgs> = {
        [P in keyof T & keyof AggregateFollower]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFollower[P]>
      : GetScalarType<T[P], AggregateFollower[P]>
  }




  export type FollowerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FollowerWhereInput
    orderBy?: FollowerOrderByWithAggregationInput | FollowerOrderByWithAggregationInput[]
    by: FollowerScalarFieldEnum[] | FollowerScalarFieldEnum
    having?: FollowerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FollowerCountAggregateInputType | true
    _min?: FollowerMinAggregateInputType
    _max?: FollowerMaxAggregateInputType
  }

  export type FollowerGroupByOutputType = {
    id: string
    followerId: string
    followingId: string
    createdAt: Date
    _count: FollowerCountAggregateOutputType | null
    _min: FollowerMinAggregateOutputType | null
    _max: FollowerMaxAggregateOutputType | null
  }

  type GetFollowerGroupByPayload<T extends FollowerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FollowerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FollowerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FollowerGroupByOutputType[P]>
            : GetScalarType<T[P], FollowerGroupByOutputType[P]>
        }
      >
    >


  export type FollowerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    followerId?: boolean
    followingId?: boolean
    createdAt?: boolean
    follower?: boolean | UserDefaultArgs<ExtArgs>
    following?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["follower"]>

  export type FollowerSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    followerId?: boolean
    followingId?: boolean
    createdAt?: boolean
    follower?: boolean | UserDefaultArgs<ExtArgs>
    following?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["follower"]>

  export type FollowerSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    followerId?: boolean
    followingId?: boolean
    createdAt?: boolean
    follower?: boolean | UserDefaultArgs<ExtArgs>
    following?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["follower"]>

  export type FollowerSelectScalar = {
    id?: boolean
    followerId?: boolean
    followingId?: boolean
    createdAt?: boolean
  }

  export type FollowerOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "followerId" | "followingId" | "createdAt", ExtArgs["result"]["follower"]>
  export type FollowerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    follower?: boolean | UserDefaultArgs<ExtArgs>
    following?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type FollowerIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    follower?: boolean | UserDefaultArgs<ExtArgs>
    following?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type FollowerIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    follower?: boolean | UserDefaultArgs<ExtArgs>
    following?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $FollowerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Follower"
    objects: {
      follower: Prisma.$UserPayload<ExtArgs>
      following: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      followerId: string
      followingId: string
      createdAt: Date
    }, ExtArgs["result"]["follower"]>
    composites: {}
  }

  type FollowerGetPayload<S extends boolean | null | undefined | FollowerDefaultArgs> = $Result.GetResult<Prisma.$FollowerPayload, S>

  type FollowerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FollowerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FollowerCountAggregateInputType | true
    }

  export interface FollowerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Follower'], meta: { name: 'Follower' } }
    /**
     * Find zero or one Follower that matches the filter.
     * @param {FollowerFindUniqueArgs} args - Arguments to find a Follower
     * @example
     * // Get one Follower
     * const follower = await prisma.follower.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FollowerFindUniqueArgs>(args: SelectSubset<T, FollowerFindUniqueArgs<ExtArgs>>): Prisma__FollowerClient<$Result.GetResult<Prisma.$FollowerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Follower that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FollowerFindUniqueOrThrowArgs} args - Arguments to find a Follower
     * @example
     * // Get one Follower
     * const follower = await prisma.follower.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FollowerFindUniqueOrThrowArgs>(args: SelectSubset<T, FollowerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FollowerClient<$Result.GetResult<Prisma.$FollowerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Follower that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FollowerFindFirstArgs} args - Arguments to find a Follower
     * @example
     * // Get one Follower
     * const follower = await prisma.follower.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FollowerFindFirstArgs>(args?: SelectSubset<T, FollowerFindFirstArgs<ExtArgs>>): Prisma__FollowerClient<$Result.GetResult<Prisma.$FollowerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Follower that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FollowerFindFirstOrThrowArgs} args - Arguments to find a Follower
     * @example
     * // Get one Follower
     * const follower = await prisma.follower.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FollowerFindFirstOrThrowArgs>(args?: SelectSubset<T, FollowerFindFirstOrThrowArgs<ExtArgs>>): Prisma__FollowerClient<$Result.GetResult<Prisma.$FollowerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Followers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FollowerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Followers
     * const followers = await prisma.follower.findMany()
     * 
     * // Get first 10 Followers
     * const followers = await prisma.follower.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const followerWithIdOnly = await prisma.follower.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FollowerFindManyArgs>(args?: SelectSubset<T, FollowerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FollowerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Follower.
     * @param {FollowerCreateArgs} args - Arguments to create a Follower.
     * @example
     * // Create one Follower
     * const Follower = await prisma.follower.create({
     *   data: {
     *     // ... data to create a Follower
     *   }
     * })
     * 
     */
    create<T extends FollowerCreateArgs>(args: SelectSubset<T, FollowerCreateArgs<ExtArgs>>): Prisma__FollowerClient<$Result.GetResult<Prisma.$FollowerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Followers.
     * @param {FollowerCreateManyArgs} args - Arguments to create many Followers.
     * @example
     * // Create many Followers
     * const follower = await prisma.follower.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FollowerCreateManyArgs>(args?: SelectSubset<T, FollowerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Followers and returns the data saved in the database.
     * @param {FollowerCreateManyAndReturnArgs} args - Arguments to create many Followers.
     * @example
     * // Create many Followers
     * const follower = await prisma.follower.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Followers and only return the `id`
     * const followerWithIdOnly = await prisma.follower.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FollowerCreateManyAndReturnArgs>(args?: SelectSubset<T, FollowerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FollowerPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Follower.
     * @param {FollowerDeleteArgs} args - Arguments to delete one Follower.
     * @example
     * // Delete one Follower
     * const Follower = await prisma.follower.delete({
     *   where: {
     *     // ... filter to delete one Follower
     *   }
     * })
     * 
     */
    delete<T extends FollowerDeleteArgs>(args: SelectSubset<T, FollowerDeleteArgs<ExtArgs>>): Prisma__FollowerClient<$Result.GetResult<Prisma.$FollowerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Follower.
     * @param {FollowerUpdateArgs} args - Arguments to update one Follower.
     * @example
     * // Update one Follower
     * const follower = await prisma.follower.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FollowerUpdateArgs>(args: SelectSubset<T, FollowerUpdateArgs<ExtArgs>>): Prisma__FollowerClient<$Result.GetResult<Prisma.$FollowerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Followers.
     * @param {FollowerDeleteManyArgs} args - Arguments to filter Followers to delete.
     * @example
     * // Delete a few Followers
     * const { count } = await prisma.follower.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FollowerDeleteManyArgs>(args?: SelectSubset<T, FollowerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Followers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FollowerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Followers
     * const follower = await prisma.follower.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FollowerUpdateManyArgs>(args: SelectSubset<T, FollowerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Followers and returns the data updated in the database.
     * @param {FollowerUpdateManyAndReturnArgs} args - Arguments to update many Followers.
     * @example
     * // Update many Followers
     * const follower = await prisma.follower.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Followers and only return the `id`
     * const followerWithIdOnly = await prisma.follower.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FollowerUpdateManyAndReturnArgs>(args: SelectSubset<T, FollowerUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FollowerPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Follower.
     * @param {FollowerUpsertArgs} args - Arguments to update or create a Follower.
     * @example
     * // Update or create a Follower
     * const follower = await prisma.follower.upsert({
     *   create: {
     *     // ... data to create a Follower
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Follower we want to update
     *   }
     * })
     */
    upsert<T extends FollowerUpsertArgs>(args: SelectSubset<T, FollowerUpsertArgs<ExtArgs>>): Prisma__FollowerClient<$Result.GetResult<Prisma.$FollowerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Followers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FollowerCountArgs} args - Arguments to filter Followers to count.
     * @example
     * // Count the number of Followers
     * const count = await prisma.follower.count({
     *   where: {
     *     // ... the filter for the Followers we want to count
     *   }
     * })
    **/
    count<T extends FollowerCountArgs>(
      args?: Subset<T, FollowerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FollowerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Follower.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FollowerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FollowerAggregateArgs>(args: Subset<T, FollowerAggregateArgs>): Prisma.PrismaPromise<GetFollowerAggregateType<T>>

    /**
     * Group by Follower.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FollowerGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FollowerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FollowerGroupByArgs['orderBy'] }
        : { orderBy?: FollowerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FollowerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFollowerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Follower model
   */
  readonly fields: FollowerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Follower.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FollowerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    follower<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    following<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Follower model
   */
  interface FollowerFieldRefs {
    readonly id: FieldRef<"Follower", 'String'>
    readonly followerId: FieldRef<"Follower", 'String'>
    readonly followingId: FieldRef<"Follower", 'String'>
    readonly createdAt: FieldRef<"Follower", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Follower findUnique
   */
  export type FollowerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Follower
     */
    select?: FollowerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Follower
     */
    omit?: FollowerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FollowerInclude<ExtArgs> | null
    /**
     * Filter, which Follower to fetch.
     */
    where: FollowerWhereUniqueInput
  }

  /**
   * Follower findUniqueOrThrow
   */
  export type FollowerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Follower
     */
    select?: FollowerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Follower
     */
    omit?: FollowerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FollowerInclude<ExtArgs> | null
    /**
     * Filter, which Follower to fetch.
     */
    where: FollowerWhereUniqueInput
  }

  /**
   * Follower findFirst
   */
  export type FollowerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Follower
     */
    select?: FollowerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Follower
     */
    omit?: FollowerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FollowerInclude<ExtArgs> | null
    /**
     * Filter, which Follower to fetch.
     */
    where?: FollowerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Followers to fetch.
     */
    orderBy?: FollowerOrderByWithRelationInput | FollowerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Followers.
     */
    cursor?: FollowerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Followers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Followers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Followers.
     */
    distinct?: FollowerScalarFieldEnum | FollowerScalarFieldEnum[]
  }

  /**
   * Follower findFirstOrThrow
   */
  export type FollowerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Follower
     */
    select?: FollowerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Follower
     */
    omit?: FollowerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FollowerInclude<ExtArgs> | null
    /**
     * Filter, which Follower to fetch.
     */
    where?: FollowerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Followers to fetch.
     */
    orderBy?: FollowerOrderByWithRelationInput | FollowerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Followers.
     */
    cursor?: FollowerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Followers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Followers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Followers.
     */
    distinct?: FollowerScalarFieldEnum | FollowerScalarFieldEnum[]
  }

  /**
   * Follower findMany
   */
  export type FollowerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Follower
     */
    select?: FollowerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Follower
     */
    omit?: FollowerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FollowerInclude<ExtArgs> | null
    /**
     * Filter, which Followers to fetch.
     */
    where?: FollowerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Followers to fetch.
     */
    orderBy?: FollowerOrderByWithRelationInput | FollowerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Followers.
     */
    cursor?: FollowerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Followers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Followers.
     */
    skip?: number
    distinct?: FollowerScalarFieldEnum | FollowerScalarFieldEnum[]
  }

  /**
   * Follower create
   */
  export type FollowerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Follower
     */
    select?: FollowerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Follower
     */
    omit?: FollowerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FollowerInclude<ExtArgs> | null
    /**
     * The data needed to create a Follower.
     */
    data: XOR<FollowerCreateInput, FollowerUncheckedCreateInput>
  }

  /**
   * Follower createMany
   */
  export type FollowerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Followers.
     */
    data: FollowerCreateManyInput | FollowerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Follower createManyAndReturn
   */
  export type FollowerCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Follower
     */
    select?: FollowerSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Follower
     */
    omit?: FollowerOmit<ExtArgs> | null
    /**
     * The data used to create many Followers.
     */
    data: FollowerCreateManyInput | FollowerCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FollowerIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Follower update
   */
  export type FollowerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Follower
     */
    select?: FollowerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Follower
     */
    omit?: FollowerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FollowerInclude<ExtArgs> | null
    /**
     * The data needed to update a Follower.
     */
    data: XOR<FollowerUpdateInput, FollowerUncheckedUpdateInput>
    /**
     * Choose, which Follower to update.
     */
    where: FollowerWhereUniqueInput
  }

  /**
   * Follower updateMany
   */
  export type FollowerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Followers.
     */
    data: XOR<FollowerUpdateManyMutationInput, FollowerUncheckedUpdateManyInput>
    /**
     * Filter which Followers to update
     */
    where?: FollowerWhereInput
    /**
     * Limit how many Followers to update.
     */
    limit?: number
  }

  /**
   * Follower updateManyAndReturn
   */
  export type FollowerUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Follower
     */
    select?: FollowerSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Follower
     */
    omit?: FollowerOmit<ExtArgs> | null
    /**
     * The data used to update Followers.
     */
    data: XOR<FollowerUpdateManyMutationInput, FollowerUncheckedUpdateManyInput>
    /**
     * Filter which Followers to update
     */
    where?: FollowerWhereInput
    /**
     * Limit how many Followers to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FollowerIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Follower upsert
   */
  export type FollowerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Follower
     */
    select?: FollowerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Follower
     */
    omit?: FollowerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FollowerInclude<ExtArgs> | null
    /**
     * The filter to search for the Follower to update in case it exists.
     */
    where: FollowerWhereUniqueInput
    /**
     * In case the Follower found by the `where` argument doesn't exist, create a new Follower with this data.
     */
    create: XOR<FollowerCreateInput, FollowerUncheckedCreateInput>
    /**
     * In case the Follower was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FollowerUpdateInput, FollowerUncheckedUpdateInput>
  }

  /**
   * Follower delete
   */
  export type FollowerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Follower
     */
    select?: FollowerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Follower
     */
    omit?: FollowerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FollowerInclude<ExtArgs> | null
    /**
     * Filter which Follower to delete.
     */
    where: FollowerWhereUniqueInput
  }

  /**
   * Follower deleteMany
   */
  export type FollowerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Followers to delete
     */
    where?: FollowerWhereInput
    /**
     * Limit how many Followers to delete.
     */
    limit?: number
  }

  /**
   * Follower without action
   */
  export type FollowerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Follower
     */
    select?: FollowerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Follower
     */
    omit?: FollowerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FollowerInclude<ExtArgs> | null
  }


  /**
   * Model Video
   */

  export type AggregateVideo = {
    _count: VideoCountAggregateOutputType | null
    _avg: VideoAvgAggregateOutputType | null
    _sum: VideoSumAggregateOutputType | null
    _min: VideoMinAggregateOutputType | null
    _max: VideoMaxAggregateOutputType | null
  }

  export type VideoAvgAggregateOutputType = {
    id: number | null
    duration: number | null
    price: number | null
    viewCount: number | null
    likeCount: number | null
    commentCount: number | null
  }

  export type VideoSumAggregateOutputType = {
    id: number | null
    duration: number | null
    price: number | null
    viewCount: number | null
    likeCount: number | null
    commentCount: number | null
  }

  export type VideoMinAggregateOutputType = {
    id: number | null
    user_id: string | null
    title: string | null
    description: string | null
    assetId: string | null
    uploadId: string | null
    playbackId: string | null
    status: string | null
    duration: number | null
    aspectRatio: string | null
    thumbnailUrl: string | null
    videoUrl: string | null
    isPublished: boolean | null
    isPremium: boolean | null
    price: number | null
    viewCount: number | null
    likeCount: number | null
    commentCount: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VideoMaxAggregateOutputType = {
    id: number | null
    user_id: string | null
    title: string | null
    description: string | null
    assetId: string | null
    uploadId: string | null
    playbackId: string | null
    status: string | null
    duration: number | null
    aspectRatio: string | null
    thumbnailUrl: string | null
    videoUrl: string | null
    isPublished: boolean | null
    isPremium: boolean | null
    price: number | null
    viewCount: number | null
    likeCount: number | null
    commentCount: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VideoCountAggregateOutputType = {
    id: number
    user_id: number
    title: number
    description: number
    assetId: number
    uploadId: number
    playbackId: number
    status: number
    duration: number
    aspectRatio: number
    thumbnailUrl: number
    videoUrl: number
    isPublished: number
    isPremium: number
    price: number
    viewCount: number
    likeCount: number
    commentCount: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type VideoAvgAggregateInputType = {
    id?: true
    duration?: true
    price?: true
    viewCount?: true
    likeCount?: true
    commentCount?: true
  }

  export type VideoSumAggregateInputType = {
    id?: true
    duration?: true
    price?: true
    viewCount?: true
    likeCount?: true
    commentCount?: true
  }

  export type VideoMinAggregateInputType = {
    id?: true
    user_id?: true
    title?: true
    description?: true
    assetId?: true
    uploadId?: true
    playbackId?: true
    status?: true
    duration?: true
    aspectRatio?: true
    thumbnailUrl?: true
    videoUrl?: true
    isPublished?: true
    isPremium?: true
    price?: true
    viewCount?: true
    likeCount?: true
    commentCount?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VideoMaxAggregateInputType = {
    id?: true
    user_id?: true
    title?: true
    description?: true
    assetId?: true
    uploadId?: true
    playbackId?: true
    status?: true
    duration?: true
    aspectRatio?: true
    thumbnailUrl?: true
    videoUrl?: true
    isPublished?: true
    isPremium?: true
    price?: true
    viewCount?: true
    likeCount?: true
    commentCount?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VideoCountAggregateInputType = {
    id?: true
    user_id?: true
    title?: true
    description?: true
    assetId?: true
    uploadId?: true
    playbackId?: true
    status?: true
    duration?: true
    aspectRatio?: true
    thumbnailUrl?: true
    videoUrl?: true
    isPublished?: true
    isPremium?: true
    price?: true
    viewCount?: true
    likeCount?: true
    commentCount?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type VideoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Video to aggregate.
     */
    where?: VideoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Videos to fetch.
     */
    orderBy?: VideoOrderByWithRelationInput | VideoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VideoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Videos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Videos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Videos
    **/
    _count?: true | VideoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: VideoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: VideoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VideoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VideoMaxAggregateInputType
  }

  export type GetVideoAggregateType<T extends VideoAggregateArgs> = {
        [P in keyof T & keyof AggregateVideo]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVideo[P]>
      : GetScalarType<T[P], AggregateVideo[P]>
  }




  export type VideoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VideoWhereInput
    orderBy?: VideoOrderByWithAggregationInput | VideoOrderByWithAggregationInput[]
    by: VideoScalarFieldEnum[] | VideoScalarFieldEnum
    having?: VideoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VideoCountAggregateInputType | true
    _avg?: VideoAvgAggregateInputType
    _sum?: VideoSumAggregateInputType
    _min?: VideoMinAggregateInputType
    _max?: VideoMaxAggregateInputType
  }

  export type VideoGroupByOutputType = {
    id: number
    user_id: string
    title: string
    description: string | null
    assetId: string | null
    uploadId: string | null
    playbackId: string | null
    status: string
    duration: number | null
    aspectRatio: string | null
    thumbnailUrl: string | null
    videoUrl: string | null
    isPublished: boolean
    isPremium: boolean
    price: number | null
    viewCount: number
    likeCount: number
    commentCount: number
    createdAt: Date
    updatedAt: Date
    _count: VideoCountAggregateOutputType | null
    _avg: VideoAvgAggregateOutputType | null
    _sum: VideoSumAggregateOutputType | null
    _min: VideoMinAggregateOutputType | null
    _max: VideoMaxAggregateOutputType | null
  }

  type GetVideoGroupByPayload<T extends VideoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VideoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VideoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VideoGroupByOutputType[P]>
            : GetScalarType<T[P], VideoGroupByOutputType[P]>
        }
      >
    >


  export type VideoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    title?: boolean
    description?: boolean
    assetId?: boolean
    uploadId?: boolean
    playbackId?: boolean
    status?: boolean
    duration?: boolean
    aspectRatio?: boolean
    thumbnailUrl?: boolean
    videoUrl?: boolean
    isPublished?: boolean
    isPremium?: boolean
    price?: boolean
    viewCount?: boolean
    likeCount?: boolean
    commentCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    metadata?: boolean | Video$metadataArgs<ExtArgs>
    comments?: boolean | Video$commentsArgs<ExtArgs>
    likes?: boolean | Video$likesArgs<ExtArgs>
    views?: boolean | Video$viewsArgs<ExtArgs>
    _count?: boolean | VideoCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["video"]>

  export type VideoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    title?: boolean
    description?: boolean
    assetId?: boolean
    uploadId?: boolean
    playbackId?: boolean
    status?: boolean
    duration?: boolean
    aspectRatio?: boolean
    thumbnailUrl?: boolean
    videoUrl?: boolean
    isPublished?: boolean
    isPremium?: boolean
    price?: boolean
    viewCount?: boolean
    likeCount?: boolean
    commentCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["video"]>

  export type VideoSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    title?: boolean
    description?: boolean
    assetId?: boolean
    uploadId?: boolean
    playbackId?: boolean
    status?: boolean
    duration?: boolean
    aspectRatio?: boolean
    thumbnailUrl?: boolean
    videoUrl?: boolean
    isPublished?: boolean
    isPremium?: boolean
    price?: boolean
    viewCount?: boolean
    likeCount?: boolean
    commentCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["video"]>

  export type VideoSelectScalar = {
    id?: boolean
    user_id?: boolean
    title?: boolean
    description?: boolean
    assetId?: boolean
    uploadId?: boolean
    playbackId?: boolean
    status?: boolean
    duration?: boolean
    aspectRatio?: boolean
    thumbnailUrl?: boolean
    videoUrl?: boolean
    isPublished?: boolean
    isPremium?: boolean
    price?: boolean
    viewCount?: boolean
    likeCount?: boolean
    commentCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type VideoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "user_id" | "title" | "description" | "assetId" | "uploadId" | "playbackId" | "status" | "duration" | "aspectRatio" | "thumbnailUrl" | "videoUrl" | "isPublished" | "isPremium" | "price" | "viewCount" | "likeCount" | "commentCount" | "createdAt" | "updatedAt", ExtArgs["result"]["video"]>
  export type VideoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    metadata?: boolean | Video$metadataArgs<ExtArgs>
    comments?: boolean | Video$commentsArgs<ExtArgs>
    likes?: boolean | Video$likesArgs<ExtArgs>
    views?: boolean | Video$viewsArgs<ExtArgs>
    _count?: boolean | VideoCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type VideoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type VideoIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $VideoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Video"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      metadata: Prisma.$VideoMetadataPayload<ExtArgs> | null
      comments: Prisma.$CommentPayload<ExtArgs>[]
      likes: Prisma.$LikePayload<ExtArgs>[]
      views: Prisma.$VideoViewPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      user_id: string
      title: string
      description: string | null
      assetId: string | null
      uploadId: string | null
      playbackId: string | null
      status: string
      duration: number | null
      aspectRatio: string | null
      thumbnailUrl: string | null
      videoUrl: string | null
      isPublished: boolean
      isPremium: boolean
      price: number | null
      viewCount: number
      likeCount: number
      commentCount: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["video"]>
    composites: {}
  }

  type VideoGetPayload<S extends boolean | null | undefined | VideoDefaultArgs> = $Result.GetResult<Prisma.$VideoPayload, S>

  type VideoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VideoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VideoCountAggregateInputType | true
    }

  export interface VideoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Video'], meta: { name: 'Video' } }
    /**
     * Find zero or one Video that matches the filter.
     * @param {VideoFindUniqueArgs} args - Arguments to find a Video
     * @example
     * // Get one Video
     * const video = await prisma.video.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VideoFindUniqueArgs>(args: SelectSubset<T, VideoFindUniqueArgs<ExtArgs>>): Prisma__VideoClient<$Result.GetResult<Prisma.$VideoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Video that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VideoFindUniqueOrThrowArgs} args - Arguments to find a Video
     * @example
     * // Get one Video
     * const video = await prisma.video.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VideoFindUniqueOrThrowArgs>(args: SelectSubset<T, VideoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VideoClient<$Result.GetResult<Prisma.$VideoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Video that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VideoFindFirstArgs} args - Arguments to find a Video
     * @example
     * // Get one Video
     * const video = await prisma.video.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VideoFindFirstArgs>(args?: SelectSubset<T, VideoFindFirstArgs<ExtArgs>>): Prisma__VideoClient<$Result.GetResult<Prisma.$VideoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Video that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VideoFindFirstOrThrowArgs} args - Arguments to find a Video
     * @example
     * // Get one Video
     * const video = await prisma.video.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VideoFindFirstOrThrowArgs>(args?: SelectSubset<T, VideoFindFirstOrThrowArgs<ExtArgs>>): Prisma__VideoClient<$Result.GetResult<Prisma.$VideoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Videos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VideoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Videos
     * const videos = await prisma.video.findMany()
     * 
     * // Get first 10 Videos
     * const videos = await prisma.video.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const videoWithIdOnly = await prisma.video.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VideoFindManyArgs>(args?: SelectSubset<T, VideoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VideoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Video.
     * @param {VideoCreateArgs} args - Arguments to create a Video.
     * @example
     * // Create one Video
     * const Video = await prisma.video.create({
     *   data: {
     *     // ... data to create a Video
     *   }
     * })
     * 
     */
    create<T extends VideoCreateArgs>(args: SelectSubset<T, VideoCreateArgs<ExtArgs>>): Prisma__VideoClient<$Result.GetResult<Prisma.$VideoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Videos.
     * @param {VideoCreateManyArgs} args - Arguments to create many Videos.
     * @example
     * // Create many Videos
     * const video = await prisma.video.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VideoCreateManyArgs>(args?: SelectSubset<T, VideoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Videos and returns the data saved in the database.
     * @param {VideoCreateManyAndReturnArgs} args - Arguments to create many Videos.
     * @example
     * // Create many Videos
     * const video = await prisma.video.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Videos and only return the `id`
     * const videoWithIdOnly = await prisma.video.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VideoCreateManyAndReturnArgs>(args?: SelectSubset<T, VideoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VideoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Video.
     * @param {VideoDeleteArgs} args - Arguments to delete one Video.
     * @example
     * // Delete one Video
     * const Video = await prisma.video.delete({
     *   where: {
     *     // ... filter to delete one Video
     *   }
     * })
     * 
     */
    delete<T extends VideoDeleteArgs>(args: SelectSubset<T, VideoDeleteArgs<ExtArgs>>): Prisma__VideoClient<$Result.GetResult<Prisma.$VideoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Video.
     * @param {VideoUpdateArgs} args - Arguments to update one Video.
     * @example
     * // Update one Video
     * const video = await prisma.video.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VideoUpdateArgs>(args: SelectSubset<T, VideoUpdateArgs<ExtArgs>>): Prisma__VideoClient<$Result.GetResult<Prisma.$VideoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Videos.
     * @param {VideoDeleteManyArgs} args - Arguments to filter Videos to delete.
     * @example
     * // Delete a few Videos
     * const { count } = await prisma.video.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VideoDeleteManyArgs>(args?: SelectSubset<T, VideoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Videos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VideoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Videos
     * const video = await prisma.video.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VideoUpdateManyArgs>(args: SelectSubset<T, VideoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Videos and returns the data updated in the database.
     * @param {VideoUpdateManyAndReturnArgs} args - Arguments to update many Videos.
     * @example
     * // Update many Videos
     * const video = await prisma.video.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Videos and only return the `id`
     * const videoWithIdOnly = await prisma.video.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VideoUpdateManyAndReturnArgs>(args: SelectSubset<T, VideoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VideoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Video.
     * @param {VideoUpsertArgs} args - Arguments to update or create a Video.
     * @example
     * // Update or create a Video
     * const video = await prisma.video.upsert({
     *   create: {
     *     // ... data to create a Video
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Video we want to update
     *   }
     * })
     */
    upsert<T extends VideoUpsertArgs>(args: SelectSubset<T, VideoUpsertArgs<ExtArgs>>): Prisma__VideoClient<$Result.GetResult<Prisma.$VideoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Videos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VideoCountArgs} args - Arguments to filter Videos to count.
     * @example
     * // Count the number of Videos
     * const count = await prisma.video.count({
     *   where: {
     *     // ... the filter for the Videos we want to count
     *   }
     * })
    **/
    count<T extends VideoCountArgs>(
      args?: Subset<T, VideoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VideoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Video.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VideoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VideoAggregateArgs>(args: Subset<T, VideoAggregateArgs>): Prisma.PrismaPromise<GetVideoAggregateType<T>>

    /**
     * Group by Video.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VideoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VideoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VideoGroupByArgs['orderBy'] }
        : { orderBy?: VideoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VideoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVideoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Video model
   */
  readonly fields: VideoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Video.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VideoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    metadata<T extends Video$metadataArgs<ExtArgs> = {}>(args?: Subset<T, Video$metadataArgs<ExtArgs>>): Prisma__VideoMetadataClient<$Result.GetResult<Prisma.$VideoMetadataPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    comments<T extends Video$commentsArgs<ExtArgs> = {}>(args?: Subset<T, Video$commentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    likes<T extends Video$likesArgs<ExtArgs> = {}>(args?: Subset<T, Video$likesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LikePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    views<T extends Video$viewsArgs<ExtArgs> = {}>(args?: Subset<T, Video$viewsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VideoViewPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Video model
   */
  interface VideoFieldRefs {
    readonly id: FieldRef<"Video", 'Int'>
    readonly user_id: FieldRef<"Video", 'String'>
    readonly title: FieldRef<"Video", 'String'>
    readonly description: FieldRef<"Video", 'String'>
    readonly assetId: FieldRef<"Video", 'String'>
    readonly uploadId: FieldRef<"Video", 'String'>
    readonly playbackId: FieldRef<"Video", 'String'>
    readonly status: FieldRef<"Video", 'String'>
    readonly duration: FieldRef<"Video", 'Float'>
    readonly aspectRatio: FieldRef<"Video", 'String'>
    readonly thumbnailUrl: FieldRef<"Video", 'String'>
    readonly videoUrl: FieldRef<"Video", 'String'>
    readonly isPublished: FieldRef<"Video", 'Boolean'>
    readonly isPremium: FieldRef<"Video", 'Boolean'>
    readonly price: FieldRef<"Video", 'Float'>
    readonly viewCount: FieldRef<"Video", 'Int'>
    readonly likeCount: FieldRef<"Video", 'Int'>
    readonly commentCount: FieldRef<"Video", 'Int'>
    readonly createdAt: FieldRef<"Video", 'DateTime'>
    readonly updatedAt: FieldRef<"Video", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Video findUnique
   */
  export type VideoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Video
     */
    select?: VideoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Video
     */
    omit?: VideoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VideoInclude<ExtArgs> | null
    /**
     * Filter, which Video to fetch.
     */
    where: VideoWhereUniqueInput
  }

  /**
   * Video findUniqueOrThrow
   */
  export type VideoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Video
     */
    select?: VideoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Video
     */
    omit?: VideoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VideoInclude<ExtArgs> | null
    /**
     * Filter, which Video to fetch.
     */
    where: VideoWhereUniqueInput
  }

  /**
   * Video findFirst
   */
  export type VideoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Video
     */
    select?: VideoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Video
     */
    omit?: VideoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VideoInclude<ExtArgs> | null
    /**
     * Filter, which Video to fetch.
     */
    where?: VideoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Videos to fetch.
     */
    orderBy?: VideoOrderByWithRelationInput | VideoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Videos.
     */
    cursor?: VideoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Videos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Videos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Videos.
     */
    distinct?: VideoScalarFieldEnum | VideoScalarFieldEnum[]
  }

  /**
   * Video findFirstOrThrow
   */
  export type VideoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Video
     */
    select?: VideoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Video
     */
    omit?: VideoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VideoInclude<ExtArgs> | null
    /**
     * Filter, which Video to fetch.
     */
    where?: VideoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Videos to fetch.
     */
    orderBy?: VideoOrderByWithRelationInput | VideoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Videos.
     */
    cursor?: VideoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Videos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Videos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Videos.
     */
    distinct?: VideoScalarFieldEnum | VideoScalarFieldEnum[]
  }

  /**
   * Video findMany
   */
  export type VideoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Video
     */
    select?: VideoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Video
     */
    omit?: VideoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VideoInclude<ExtArgs> | null
    /**
     * Filter, which Videos to fetch.
     */
    where?: VideoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Videos to fetch.
     */
    orderBy?: VideoOrderByWithRelationInput | VideoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Videos.
     */
    cursor?: VideoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Videos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Videos.
     */
    skip?: number
    distinct?: VideoScalarFieldEnum | VideoScalarFieldEnum[]
  }

  /**
   * Video create
   */
  export type VideoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Video
     */
    select?: VideoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Video
     */
    omit?: VideoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VideoInclude<ExtArgs> | null
    /**
     * The data needed to create a Video.
     */
    data: XOR<VideoCreateInput, VideoUncheckedCreateInput>
  }

  /**
   * Video createMany
   */
  export type VideoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Videos.
     */
    data: VideoCreateManyInput | VideoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Video createManyAndReturn
   */
  export type VideoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Video
     */
    select?: VideoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Video
     */
    omit?: VideoOmit<ExtArgs> | null
    /**
     * The data used to create many Videos.
     */
    data: VideoCreateManyInput | VideoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VideoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Video update
   */
  export type VideoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Video
     */
    select?: VideoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Video
     */
    omit?: VideoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VideoInclude<ExtArgs> | null
    /**
     * The data needed to update a Video.
     */
    data: XOR<VideoUpdateInput, VideoUncheckedUpdateInput>
    /**
     * Choose, which Video to update.
     */
    where: VideoWhereUniqueInput
  }

  /**
   * Video updateMany
   */
  export type VideoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Videos.
     */
    data: XOR<VideoUpdateManyMutationInput, VideoUncheckedUpdateManyInput>
    /**
     * Filter which Videos to update
     */
    where?: VideoWhereInput
    /**
     * Limit how many Videos to update.
     */
    limit?: number
  }

  /**
   * Video updateManyAndReturn
   */
  export type VideoUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Video
     */
    select?: VideoSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Video
     */
    omit?: VideoOmit<ExtArgs> | null
    /**
     * The data used to update Videos.
     */
    data: XOR<VideoUpdateManyMutationInput, VideoUncheckedUpdateManyInput>
    /**
     * Filter which Videos to update
     */
    where?: VideoWhereInput
    /**
     * Limit how many Videos to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VideoIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Video upsert
   */
  export type VideoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Video
     */
    select?: VideoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Video
     */
    omit?: VideoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VideoInclude<ExtArgs> | null
    /**
     * The filter to search for the Video to update in case it exists.
     */
    where: VideoWhereUniqueInput
    /**
     * In case the Video found by the `where` argument doesn't exist, create a new Video with this data.
     */
    create: XOR<VideoCreateInput, VideoUncheckedCreateInput>
    /**
     * In case the Video was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VideoUpdateInput, VideoUncheckedUpdateInput>
  }

  /**
   * Video delete
   */
  export type VideoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Video
     */
    select?: VideoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Video
     */
    omit?: VideoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VideoInclude<ExtArgs> | null
    /**
     * Filter which Video to delete.
     */
    where: VideoWhereUniqueInput
  }

  /**
   * Video deleteMany
   */
  export type VideoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Videos to delete
     */
    where?: VideoWhereInput
    /**
     * Limit how many Videos to delete.
     */
    limit?: number
  }

  /**
   * Video.metadata
   */
  export type Video$metadataArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VideoMetadata
     */
    select?: VideoMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VideoMetadata
     */
    omit?: VideoMetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VideoMetadataInclude<ExtArgs> | null
    where?: VideoMetadataWhereInput
  }

  /**
   * Video.comments
   */
  export type Video$commentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    where?: CommentWhereInput
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    cursor?: CommentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * Video.likes
   */
  export type Video$likesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Like
     */
    select?: LikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Like
     */
    omit?: LikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikeInclude<ExtArgs> | null
    where?: LikeWhereInput
    orderBy?: LikeOrderByWithRelationInput | LikeOrderByWithRelationInput[]
    cursor?: LikeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LikeScalarFieldEnum | LikeScalarFieldEnum[]
  }

  /**
   * Video.views
   */
  export type Video$viewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VideoView
     */
    select?: VideoViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VideoView
     */
    omit?: VideoViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VideoViewInclude<ExtArgs> | null
    where?: VideoViewWhereInput
    orderBy?: VideoViewOrderByWithRelationInput | VideoViewOrderByWithRelationInput[]
    cursor?: VideoViewWhereUniqueInput
    take?: number
    skip?: number
    distinct?: VideoViewScalarFieldEnum | VideoViewScalarFieldEnum[]
  }

  /**
   * Video without action
   */
  export type VideoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Video
     */
    select?: VideoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Video
     */
    omit?: VideoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VideoInclude<ExtArgs> | null
  }


  /**
   * Model VideoMetadata
   */

  export type AggregateVideoMetadata = {
    _count: VideoMetadataCountAggregateOutputType | null
    _avg: VideoMetadataAvgAggregateOutputType | null
    _sum: VideoMetadataSumAggregateOutputType | null
    _min: VideoMetadataMinAggregateOutputType | null
    _max: VideoMetadataMaxAggregateOutputType | null
  }

  export type VideoMetadataAvgAggregateOutputType = {
    id: number | null
    videoId: number | null
    fileSize: number | null
    width: number | null
    height: number | null
    frameRate: number | null
    bitrate: number | null
  }

  export type VideoMetadataSumAggregateOutputType = {
    id: number | null
    videoId: number | null
    fileSize: number | null
    width: number | null
    height: number | null
    frameRate: number | null
    bitrate: number | null
  }

  export type VideoMetadataMinAggregateOutputType = {
    id: number | null
    videoId: number | null
    filename: string | null
    fileSize: number | null
    mimeType: string | null
    width: number | null
    height: number | null
    frameRate: number | null
    bitrate: number | null
    originalUrl: string | null
    uploadStatus: string | null
    error: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VideoMetadataMaxAggregateOutputType = {
    id: number | null
    videoId: number | null
    filename: string | null
    fileSize: number | null
    mimeType: string | null
    width: number | null
    height: number | null
    frameRate: number | null
    bitrate: number | null
    originalUrl: string | null
    uploadStatus: string | null
    error: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VideoMetadataCountAggregateOutputType = {
    id: number
    videoId: number
    filename: number
    fileSize: number
    mimeType: number
    width: number
    height: number
    frameRate: number
    bitrate: number
    originalUrl: number
    uploadStatus: number
    error: number
    metadata: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type VideoMetadataAvgAggregateInputType = {
    id?: true
    videoId?: true
    fileSize?: true
    width?: true
    height?: true
    frameRate?: true
    bitrate?: true
  }

  export type VideoMetadataSumAggregateInputType = {
    id?: true
    videoId?: true
    fileSize?: true
    width?: true
    height?: true
    frameRate?: true
    bitrate?: true
  }

  export type VideoMetadataMinAggregateInputType = {
    id?: true
    videoId?: true
    filename?: true
    fileSize?: true
    mimeType?: true
    width?: true
    height?: true
    frameRate?: true
    bitrate?: true
    originalUrl?: true
    uploadStatus?: true
    error?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VideoMetadataMaxAggregateInputType = {
    id?: true
    videoId?: true
    filename?: true
    fileSize?: true
    mimeType?: true
    width?: true
    height?: true
    frameRate?: true
    bitrate?: true
    originalUrl?: true
    uploadStatus?: true
    error?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VideoMetadataCountAggregateInputType = {
    id?: true
    videoId?: true
    filename?: true
    fileSize?: true
    mimeType?: true
    width?: true
    height?: true
    frameRate?: true
    bitrate?: true
    originalUrl?: true
    uploadStatus?: true
    error?: true
    metadata?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type VideoMetadataAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VideoMetadata to aggregate.
     */
    where?: VideoMetadataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VideoMetadata to fetch.
     */
    orderBy?: VideoMetadataOrderByWithRelationInput | VideoMetadataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VideoMetadataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VideoMetadata from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VideoMetadata.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned VideoMetadata
    **/
    _count?: true | VideoMetadataCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: VideoMetadataAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: VideoMetadataSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VideoMetadataMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VideoMetadataMaxAggregateInputType
  }

  export type GetVideoMetadataAggregateType<T extends VideoMetadataAggregateArgs> = {
        [P in keyof T & keyof AggregateVideoMetadata]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVideoMetadata[P]>
      : GetScalarType<T[P], AggregateVideoMetadata[P]>
  }




  export type VideoMetadataGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VideoMetadataWhereInput
    orderBy?: VideoMetadataOrderByWithAggregationInput | VideoMetadataOrderByWithAggregationInput[]
    by: VideoMetadataScalarFieldEnum[] | VideoMetadataScalarFieldEnum
    having?: VideoMetadataScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VideoMetadataCountAggregateInputType | true
    _avg?: VideoMetadataAvgAggregateInputType
    _sum?: VideoMetadataSumAggregateInputType
    _min?: VideoMetadataMinAggregateInputType
    _max?: VideoMetadataMaxAggregateInputType
  }

  export type VideoMetadataGroupByOutputType = {
    id: number
    videoId: number
    filename: string | null
    fileSize: number | null
    mimeType: string | null
    width: number | null
    height: number | null
    frameRate: number | null
    bitrate: number | null
    originalUrl: string | null
    uploadStatus: string | null
    error: string | null
    metadata: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: VideoMetadataCountAggregateOutputType | null
    _avg: VideoMetadataAvgAggregateOutputType | null
    _sum: VideoMetadataSumAggregateOutputType | null
    _min: VideoMetadataMinAggregateOutputType | null
    _max: VideoMetadataMaxAggregateOutputType | null
  }

  type GetVideoMetadataGroupByPayload<T extends VideoMetadataGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VideoMetadataGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VideoMetadataGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VideoMetadataGroupByOutputType[P]>
            : GetScalarType<T[P], VideoMetadataGroupByOutputType[P]>
        }
      >
    >


  export type VideoMetadataSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    videoId?: boolean
    filename?: boolean
    fileSize?: boolean
    mimeType?: boolean
    width?: boolean
    height?: boolean
    frameRate?: boolean
    bitrate?: boolean
    originalUrl?: boolean
    uploadStatus?: boolean
    error?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    video?: boolean | VideoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["videoMetadata"]>

  export type VideoMetadataSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    videoId?: boolean
    filename?: boolean
    fileSize?: boolean
    mimeType?: boolean
    width?: boolean
    height?: boolean
    frameRate?: boolean
    bitrate?: boolean
    originalUrl?: boolean
    uploadStatus?: boolean
    error?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    video?: boolean | VideoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["videoMetadata"]>

  export type VideoMetadataSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    videoId?: boolean
    filename?: boolean
    fileSize?: boolean
    mimeType?: boolean
    width?: boolean
    height?: boolean
    frameRate?: boolean
    bitrate?: boolean
    originalUrl?: boolean
    uploadStatus?: boolean
    error?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    video?: boolean | VideoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["videoMetadata"]>

  export type VideoMetadataSelectScalar = {
    id?: boolean
    videoId?: boolean
    filename?: boolean
    fileSize?: boolean
    mimeType?: boolean
    width?: boolean
    height?: boolean
    frameRate?: boolean
    bitrate?: boolean
    originalUrl?: boolean
    uploadStatus?: boolean
    error?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type VideoMetadataOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "videoId" | "filename" | "fileSize" | "mimeType" | "width" | "height" | "frameRate" | "bitrate" | "originalUrl" | "uploadStatus" | "error" | "metadata" | "createdAt" | "updatedAt", ExtArgs["result"]["videoMetadata"]>
  export type VideoMetadataInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    video?: boolean | VideoDefaultArgs<ExtArgs>
  }
  export type VideoMetadataIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    video?: boolean | VideoDefaultArgs<ExtArgs>
  }
  export type VideoMetadataIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    video?: boolean | VideoDefaultArgs<ExtArgs>
  }

  export type $VideoMetadataPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "VideoMetadata"
    objects: {
      video: Prisma.$VideoPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      videoId: number
      filename: string | null
      fileSize: number | null
      mimeType: string | null
      width: number | null
      height: number | null
      frameRate: number | null
      bitrate: number | null
      originalUrl: string | null
      uploadStatus: string | null
      error: string | null
      metadata: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["videoMetadata"]>
    composites: {}
  }

  type VideoMetadataGetPayload<S extends boolean | null | undefined | VideoMetadataDefaultArgs> = $Result.GetResult<Prisma.$VideoMetadataPayload, S>

  type VideoMetadataCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VideoMetadataFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VideoMetadataCountAggregateInputType | true
    }

  export interface VideoMetadataDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['VideoMetadata'], meta: { name: 'VideoMetadata' } }
    /**
     * Find zero or one VideoMetadata that matches the filter.
     * @param {VideoMetadataFindUniqueArgs} args - Arguments to find a VideoMetadata
     * @example
     * // Get one VideoMetadata
     * const videoMetadata = await prisma.videoMetadata.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VideoMetadataFindUniqueArgs>(args: SelectSubset<T, VideoMetadataFindUniqueArgs<ExtArgs>>): Prisma__VideoMetadataClient<$Result.GetResult<Prisma.$VideoMetadataPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one VideoMetadata that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VideoMetadataFindUniqueOrThrowArgs} args - Arguments to find a VideoMetadata
     * @example
     * // Get one VideoMetadata
     * const videoMetadata = await prisma.videoMetadata.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VideoMetadataFindUniqueOrThrowArgs>(args: SelectSubset<T, VideoMetadataFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VideoMetadataClient<$Result.GetResult<Prisma.$VideoMetadataPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VideoMetadata that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VideoMetadataFindFirstArgs} args - Arguments to find a VideoMetadata
     * @example
     * // Get one VideoMetadata
     * const videoMetadata = await prisma.videoMetadata.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VideoMetadataFindFirstArgs>(args?: SelectSubset<T, VideoMetadataFindFirstArgs<ExtArgs>>): Prisma__VideoMetadataClient<$Result.GetResult<Prisma.$VideoMetadataPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VideoMetadata that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VideoMetadataFindFirstOrThrowArgs} args - Arguments to find a VideoMetadata
     * @example
     * // Get one VideoMetadata
     * const videoMetadata = await prisma.videoMetadata.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VideoMetadataFindFirstOrThrowArgs>(args?: SelectSubset<T, VideoMetadataFindFirstOrThrowArgs<ExtArgs>>): Prisma__VideoMetadataClient<$Result.GetResult<Prisma.$VideoMetadataPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more VideoMetadata that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VideoMetadataFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all VideoMetadata
     * const videoMetadata = await prisma.videoMetadata.findMany()
     * 
     * // Get first 10 VideoMetadata
     * const videoMetadata = await prisma.videoMetadata.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const videoMetadataWithIdOnly = await prisma.videoMetadata.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VideoMetadataFindManyArgs>(args?: SelectSubset<T, VideoMetadataFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VideoMetadataPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a VideoMetadata.
     * @param {VideoMetadataCreateArgs} args - Arguments to create a VideoMetadata.
     * @example
     * // Create one VideoMetadata
     * const VideoMetadata = await prisma.videoMetadata.create({
     *   data: {
     *     // ... data to create a VideoMetadata
     *   }
     * })
     * 
     */
    create<T extends VideoMetadataCreateArgs>(args: SelectSubset<T, VideoMetadataCreateArgs<ExtArgs>>): Prisma__VideoMetadataClient<$Result.GetResult<Prisma.$VideoMetadataPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many VideoMetadata.
     * @param {VideoMetadataCreateManyArgs} args - Arguments to create many VideoMetadata.
     * @example
     * // Create many VideoMetadata
     * const videoMetadata = await prisma.videoMetadata.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VideoMetadataCreateManyArgs>(args?: SelectSubset<T, VideoMetadataCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many VideoMetadata and returns the data saved in the database.
     * @param {VideoMetadataCreateManyAndReturnArgs} args - Arguments to create many VideoMetadata.
     * @example
     * // Create many VideoMetadata
     * const videoMetadata = await prisma.videoMetadata.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many VideoMetadata and only return the `id`
     * const videoMetadataWithIdOnly = await prisma.videoMetadata.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VideoMetadataCreateManyAndReturnArgs>(args?: SelectSubset<T, VideoMetadataCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VideoMetadataPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a VideoMetadata.
     * @param {VideoMetadataDeleteArgs} args - Arguments to delete one VideoMetadata.
     * @example
     * // Delete one VideoMetadata
     * const VideoMetadata = await prisma.videoMetadata.delete({
     *   where: {
     *     // ... filter to delete one VideoMetadata
     *   }
     * })
     * 
     */
    delete<T extends VideoMetadataDeleteArgs>(args: SelectSubset<T, VideoMetadataDeleteArgs<ExtArgs>>): Prisma__VideoMetadataClient<$Result.GetResult<Prisma.$VideoMetadataPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one VideoMetadata.
     * @param {VideoMetadataUpdateArgs} args - Arguments to update one VideoMetadata.
     * @example
     * // Update one VideoMetadata
     * const videoMetadata = await prisma.videoMetadata.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VideoMetadataUpdateArgs>(args: SelectSubset<T, VideoMetadataUpdateArgs<ExtArgs>>): Prisma__VideoMetadataClient<$Result.GetResult<Prisma.$VideoMetadataPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more VideoMetadata.
     * @param {VideoMetadataDeleteManyArgs} args - Arguments to filter VideoMetadata to delete.
     * @example
     * // Delete a few VideoMetadata
     * const { count } = await prisma.videoMetadata.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VideoMetadataDeleteManyArgs>(args?: SelectSubset<T, VideoMetadataDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VideoMetadata.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VideoMetadataUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many VideoMetadata
     * const videoMetadata = await prisma.videoMetadata.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VideoMetadataUpdateManyArgs>(args: SelectSubset<T, VideoMetadataUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VideoMetadata and returns the data updated in the database.
     * @param {VideoMetadataUpdateManyAndReturnArgs} args - Arguments to update many VideoMetadata.
     * @example
     * // Update many VideoMetadata
     * const videoMetadata = await prisma.videoMetadata.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more VideoMetadata and only return the `id`
     * const videoMetadataWithIdOnly = await prisma.videoMetadata.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VideoMetadataUpdateManyAndReturnArgs>(args: SelectSubset<T, VideoMetadataUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VideoMetadataPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one VideoMetadata.
     * @param {VideoMetadataUpsertArgs} args - Arguments to update or create a VideoMetadata.
     * @example
     * // Update or create a VideoMetadata
     * const videoMetadata = await prisma.videoMetadata.upsert({
     *   create: {
     *     // ... data to create a VideoMetadata
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the VideoMetadata we want to update
     *   }
     * })
     */
    upsert<T extends VideoMetadataUpsertArgs>(args: SelectSubset<T, VideoMetadataUpsertArgs<ExtArgs>>): Prisma__VideoMetadataClient<$Result.GetResult<Prisma.$VideoMetadataPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of VideoMetadata.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VideoMetadataCountArgs} args - Arguments to filter VideoMetadata to count.
     * @example
     * // Count the number of VideoMetadata
     * const count = await prisma.videoMetadata.count({
     *   where: {
     *     // ... the filter for the VideoMetadata we want to count
     *   }
     * })
    **/
    count<T extends VideoMetadataCountArgs>(
      args?: Subset<T, VideoMetadataCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VideoMetadataCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a VideoMetadata.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VideoMetadataAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VideoMetadataAggregateArgs>(args: Subset<T, VideoMetadataAggregateArgs>): Prisma.PrismaPromise<GetVideoMetadataAggregateType<T>>

    /**
     * Group by VideoMetadata.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VideoMetadataGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VideoMetadataGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VideoMetadataGroupByArgs['orderBy'] }
        : { orderBy?: VideoMetadataGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VideoMetadataGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVideoMetadataGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the VideoMetadata model
   */
  readonly fields: VideoMetadataFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for VideoMetadata.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VideoMetadataClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    video<T extends VideoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, VideoDefaultArgs<ExtArgs>>): Prisma__VideoClient<$Result.GetResult<Prisma.$VideoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the VideoMetadata model
   */
  interface VideoMetadataFieldRefs {
    readonly id: FieldRef<"VideoMetadata", 'Int'>
    readonly videoId: FieldRef<"VideoMetadata", 'Int'>
    readonly filename: FieldRef<"VideoMetadata", 'String'>
    readonly fileSize: FieldRef<"VideoMetadata", 'Int'>
    readonly mimeType: FieldRef<"VideoMetadata", 'String'>
    readonly width: FieldRef<"VideoMetadata", 'Int'>
    readonly height: FieldRef<"VideoMetadata", 'Int'>
    readonly frameRate: FieldRef<"VideoMetadata", 'Float'>
    readonly bitrate: FieldRef<"VideoMetadata", 'Int'>
    readonly originalUrl: FieldRef<"VideoMetadata", 'String'>
    readonly uploadStatus: FieldRef<"VideoMetadata", 'String'>
    readonly error: FieldRef<"VideoMetadata", 'String'>
    readonly metadata: FieldRef<"VideoMetadata", 'Json'>
    readonly createdAt: FieldRef<"VideoMetadata", 'DateTime'>
    readonly updatedAt: FieldRef<"VideoMetadata", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * VideoMetadata findUnique
   */
  export type VideoMetadataFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VideoMetadata
     */
    select?: VideoMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VideoMetadata
     */
    omit?: VideoMetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VideoMetadataInclude<ExtArgs> | null
    /**
     * Filter, which VideoMetadata to fetch.
     */
    where: VideoMetadataWhereUniqueInput
  }

  /**
   * VideoMetadata findUniqueOrThrow
   */
  export type VideoMetadataFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VideoMetadata
     */
    select?: VideoMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VideoMetadata
     */
    omit?: VideoMetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VideoMetadataInclude<ExtArgs> | null
    /**
     * Filter, which VideoMetadata to fetch.
     */
    where: VideoMetadataWhereUniqueInput
  }

  /**
   * VideoMetadata findFirst
   */
  export type VideoMetadataFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VideoMetadata
     */
    select?: VideoMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VideoMetadata
     */
    omit?: VideoMetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VideoMetadataInclude<ExtArgs> | null
    /**
     * Filter, which VideoMetadata to fetch.
     */
    where?: VideoMetadataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VideoMetadata to fetch.
     */
    orderBy?: VideoMetadataOrderByWithRelationInput | VideoMetadataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VideoMetadata.
     */
    cursor?: VideoMetadataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VideoMetadata from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VideoMetadata.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VideoMetadata.
     */
    distinct?: VideoMetadataScalarFieldEnum | VideoMetadataScalarFieldEnum[]
  }

  /**
   * VideoMetadata findFirstOrThrow
   */
  export type VideoMetadataFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VideoMetadata
     */
    select?: VideoMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VideoMetadata
     */
    omit?: VideoMetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VideoMetadataInclude<ExtArgs> | null
    /**
     * Filter, which VideoMetadata to fetch.
     */
    where?: VideoMetadataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VideoMetadata to fetch.
     */
    orderBy?: VideoMetadataOrderByWithRelationInput | VideoMetadataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VideoMetadata.
     */
    cursor?: VideoMetadataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VideoMetadata from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VideoMetadata.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VideoMetadata.
     */
    distinct?: VideoMetadataScalarFieldEnum | VideoMetadataScalarFieldEnum[]
  }

  /**
   * VideoMetadata findMany
   */
  export type VideoMetadataFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VideoMetadata
     */
    select?: VideoMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VideoMetadata
     */
    omit?: VideoMetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VideoMetadataInclude<ExtArgs> | null
    /**
     * Filter, which VideoMetadata to fetch.
     */
    where?: VideoMetadataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VideoMetadata to fetch.
     */
    orderBy?: VideoMetadataOrderByWithRelationInput | VideoMetadataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing VideoMetadata.
     */
    cursor?: VideoMetadataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VideoMetadata from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VideoMetadata.
     */
    skip?: number
    distinct?: VideoMetadataScalarFieldEnum | VideoMetadataScalarFieldEnum[]
  }

  /**
   * VideoMetadata create
   */
  export type VideoMetadataCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VideoMetadata
     */
    select?: VideoMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VideoMetadata
     */
    omit?: VideoMetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VideoMetadataInclude<ExtArgs> | null
    /**
     * The data needed to create a VideoMetadata.
     */
    data: XOR<VideoMetadataCreateInput, VideoMetadataUncheckedCreateInput>
  }

  /**
   * VideoMetadata createMany
   */
  export type VideoMetadataCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many VideoMetadata.
     */
    data: VideoMetadataCreateManyInput | VideoMetadataCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * VideoMetadata createManyAndReturn
   */
  export type VideoMetadataCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VideoMetadata
     */
    select?: VideoMetadataSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VideoMetadata
     */
    omit?: VideoMetadataOmit<ExtArgs> | null
    /**
     * The data used to create many VideoMetadata.
     */
    data: VideoMetadataCreateManyInput | VideoMetadataCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VideoMetadataIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * VideoMetadata update
   */
  export type VideoMetadataUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VideoMetadata
     */
    select?: VideoMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VideoMetadata
     */
    omit?: VideoMetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VideoMetadataInclude<ExtArgs> | null
    /**
     * The data needed to update a VideoMetadata.
     */
    data: XOR<VideoMetadataUpdateInput, VideoMetadataUncheckedUpdateInput>
    /**
     * Choose, which VideoMetadata to update.
     */
    where: VideoMetadataWhereUniqueInput
  }

  /**
   * VideoMetadata updateMany
   */
  export type VideoMetadataUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update VideoMetadata.
     */
    data: XOR<VideoMetadataUpdateManyMutationInput, VideoMetadataUncheckedUpdateManyInput>
    /**
     * Filter which VideoMetadata to update
     */
    where?: VideoMetadataWhereInput
    /**
     * Limit how many VideoMetadata to update.
     */
    limit?: number
  }

  /**
   * VideoMetadata updateManyAndReturn
   */
  export type VideoMetadataUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VideoMetadata
     */
    select?: VideoMetadataSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VideoMetadata
     */
    omit?: VideoMetadataOmit<ExtArgs> | null
    /**
     * The data used to update VideoMetadata.
     */
    data: XOR<VideoMetadataUpdateManyMutationInput, VideoMetadataUncheckedUpdateManyInput>
    /**
     * Filter which VideoMetadata to update
     */
    where?: VideoMetadataWhereInput
    /**
     * Limit how many VideoMetadata to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VideoMetadataIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * VideoMetadata upsert
   */
  export type VideoMetadataUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VideoMetadata
     */
    select?: VideoMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VideoMetadata
     */
    omit?: VideoMetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VideoMetadataInclude<ExtArgs> | null
    /**
     * The filter to search for the VideoMetadata to update in case it exists.
     */
    where: VideoMetadataWhereUniqueInput
    /**
     * In case the VideoMetadata found by the `where` argument doesn't exist, create a new VideoMetadata with this data.
     */
    create: XOR<VideoMetadataCreateInput, VideoMetadataUncheckedCreateInput>
    /**
     * In case the VideoMetadata was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VideoMetadataUpdateInput, VideoMetadataUncheckedUpdateInput>
  }

  /**
   * VideoMetadata delete
   */
  export type VideoMetadataDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VideoMetadata
     */
    select?: VideoMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VideoMetadata
     */
    omit?: VideoMetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VideoMetadataInclude<ExtArgs> | null
    /**
     * Filter which VideoMetadata to delete.
     */
    where: VideoMetadataWhereUniqueInput
  }

  /**
   * VideoMetadata deleteMany
   */
  export type VideoMetadataDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VideoMetadata to delete
     */
    where?: VideoMetadataWhereInput
    /**
     * Limit how many VideoMetadata to delete.
     */
    limit?: number
  }

  /**
   * VideoMetadata without action
   */
  export type VideoMetadataDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VideoMetadata
     */
    select?: VideoMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VideoMetadata
     */
    omit?: VideoMetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VideoMetadataInclude<ExtArgs> | null
  }


  /**
   * Model Comment
   */

  export type AggregateComment = {
    _count: CommentCountAggregateOutputType | null
    _avg: CommentAvgAggregateOutputType | null
    _sum: CommentSumAggregateOutputType | null
    _min: CommentMinAggregateOutputType | null
    _max: CommentMaxAggregateOutputType | null
  }

  export type CommentAvgAggregateOutputType = {
    id: number | null
    videoId: number | null
  }

  export type CommentSumAggregateOutputType = {
    id: number | null
    videoId: number | null
  }

  export type CommentMinAggregateOutputType = {
    id: number | null
    content: string | null
    userId: string | null
    videoId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CommentMaxAggregateOutputType = {
    id: number | null
    content: string | null
    userId: string | null
    videoId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CommentCountAggregateOutputType = {
    id: number
    content: number
    userId: number
    videoId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CommentAvgAggregateInputType = {
    id?: true
    videoId?: true
  }

  export type CommentSumAggregateInputType = {
    id?: true
    videoId?: true
  }

  export type CommentMinAggregateInputType = {
    id?: true
    content?: true
    userId?: true
    videoId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CommentMaxAggregateInputType = {
    id?: true
    content?: true
    userId?: true
    videoId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CommentCountAggregateInputType = {
    id?: true
    content?: true
    userId?: true
    videoId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CommentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Comment to aggregate.
     */
    where?: CommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Comments to fetch.
     */
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Comments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Comments
    **/
    _count?: true | CommentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CommentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CommentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CommentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CommentMaxAggregateInputType
  }

  export type GetCommentAggregateType<T extends CommentAggregateArgs> = {
        [P in keyof T & keyof AggregateComment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateComment[P]>
      : GetScalarType<T[P], AggregateComment[P]>
  }




  export type CommentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommentWhereInput
    orderBy?: CommentOrderByWithAggregationInput | CommentOrderByWithAggregationInput[]
    by: CommentScalarFieldEnum[] | CommentScalarFieldEnum
    having?: CommentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CommentCountAggregateInputType | true
    _avg?: CommentAvgAggregateInputType
    _sum?: CommentSumAggregateInputType
    _min?: CommentMinAggregateInputType
    _max?: CommentMaxAggregateInputType
  }

  export type CommentGroupByOutputType = {
    id: number
    content: string
    userId: string
    videoId: number
    createdAt: Date
    updatedAt: Date
    _count: CommentCountAggregateOutputType | null
    _avg: CommentAvgAggregateOutputType | null
    _sum: CommentSumAggregateOutputType | null
    _min: CommentMinAggregateOutputType | null
    _max: CommentMaxAggregateOutputType | null
  }

  type GetCommentGroupByPayload<T extends CommentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CommentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CommentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CommentGroupByOutputType[P]>
            : GetScalarType<T[P], CommentGroupByOutputType[P]>
        }
      >
    >


  export type CommentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    userId?: boolean
    videoId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    video?: boolean | VideoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["comment"]>

  export type CommentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    userId?: boolean
    videoId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    video?: boolean | VideoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["comment"]>

  export type CommentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    userId?: boolean
    videoId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    video?: boolean | VideoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["comment"]>

  export type CommentSelectScalar = {
    id?: boolean
    content?: boolean
    userId?: boolean
    videoId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CommentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "content" | "userId" | "videoId" | "createdAt" | "updatedAt", ExtArgs["result"]["comment"]>
  export type CommentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    video?: boolean | VideoDefaultArgs<ExtArgs>
  }
  export type CommentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    video?: boolean | VideoDefaultArgs<ExtArgs>
  }
  export type CommentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    video?: boolean | VideoDefaultArgs<ExtArgs>
  }

  export type $CommentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Comment"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      video: Prisma.$VideoPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      content: string
      userId: string
      videoId: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["comment"]>
    composites: {}
  }

  type CommentGetPayload<S extends boolean | null | undefined | CommentDefaultArgs> = $Result.GetResult<Prisma.$CommentPayload, S>

  type CommentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CommentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CommentCountAggregateInputType | true
    }

  export interface CommentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Comment'], meta: { name: 'Comment' } }
    /**
     * Find zero or one Comment that matches the filter.
     * @param {CommentFindUniqueArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CommentFindUniqueArgs>(args: SelectSubset<T, CommentFindUniqueArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Comment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CommentFindUniqueOrThrowArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CommentFindUniqueOrThrowArgs>(args: SelectSubset<T, CommentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Comment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentFindFirstArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CommentFindFirstArgs>(args?: SelectSubset<T, CommentFindFirstArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Comment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentFindFirstOrThrowArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CommentFindFirstOrThrowArgs>(args?: SelectSubset<T, CommentFindFirstOrThrowArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Comments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Comments
     * const comments = await prisma.comment.findMany()
     * 
     * // Get first 10 Comments
     * const comments = await prisma.comment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const commentWithIdOnly = await prisma.comment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CommentFindManyArgs>(args?: SelectSubset<T, CommentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Comment.
     * @param {CommentCreateArgs} args - Arguments to create a Comment.
     * @example
     * // Create one Comment
     * const Comment = await prisma.comment.create({
     *   data: {
     *     // ... data to create a Comment
     *   }
     * })
     * 
     */
    create<T extends CommentCreateArgs>(args: SelectSubset<T, CommentCreateArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Comments.
     * @param {CommentCreateManyArgs} args - Arguments to create many Comments.
     * @example
     * // Create many Comments
     * const comment = await prisma.comment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CommentCreateManyArgs>(args?: SelectSubset<T, CommentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Comments and returns the data saved in the database.
     * @param {CommentCreateManyAndReturnArgs} args - Arguments to create many Comments.
     * @example
     * // Create many Comments
     * const comment = await prisma.comment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Comments and only return the `id`
     * const commentWithIdOnly = await prisma.comment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CommentCreateManyAndReturnArgs>(args?: SelectSubset<T, CommentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Comment.
     * @param {CommentDeleteArgs} args - Arguments to delete one Comment.
     * @example
     * // Delete one Comment
     * const Comment = await prisma.comment.delete({
     *   where: {
     *     // ... filter to delete one Comment
     *   }
     * })
     * 
     */
    delete<T extends CommentDeleteArgs>(args: SelectSubset<T, CommentDeleteArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Comment.
     * @param {CommentUpdateArgs} args - Arguments to update one Comment.
     * @example
     * // Update one Comment
     * const comment = await prisma.comment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CommentUpdateArgs>(args: SelectSubset<T, CommentUpdateArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Comments.
     * @param {CommentDeleteManyArgs} args - Arguments to filter Comments to delete.
     * @example
     * // Delete a few Comments
     * const { count } = await prisma.comment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CommentDeleteManyArgs>(args?: SelectSubset<T, CommentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Comments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Comments
     * const comment = await prisma.comment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CommentUpdateManyArgs>(args: SelectSubset<T, CommentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Comments and returns the data updated in the database.
     * @param {CommentUpdateManyAndReturnArgs} args - Arguments to update many Comments.
     * @example
     * // Update many Comments
     * const comment = await prisma.comment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Comments and only return the `id`
     * const commentWithIdOnly = await prisma.comment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CommentUpdateManyAndReturnArgs>(args: SelectSubset<T, CommentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Comment.
     * @param {CommentUpsertArgs} args - Arguments to update or create a Comment.
     * @example
     * // Update or create a Comment
     * const comment = await prisma.comment.upsert({
     *   create: {
     *     // ... data to create a Comment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Comment we want to update
     *   }
     * })
     */
    upsert<T extends CommentUpsertArgs>(args: SelectSubset<T, CommentUpsertArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Comments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentCountArgs} args - Arguments to filter Comments to count.
     * @example
     * // Count the number of Comments
     * const count = await prisma.comment.count({
     *   where: {
     *     // ... the filter for the Comments we want to count
     *   }
     * })
    **/
    count<T extends CommentCountArgs>(
      args?: Subset<T, CommentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CommentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Comment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CommentAggregateArgs>(args: Subset<T, CommentAggregateArgs>): Prisma.PrismaPromise<GetCommentAggregateType<T>>

    /**
     * Group by Comment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CommentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CommentGroupByArgs['orderBy'] }
        : { orderBy?: CommentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CommentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCommentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Comment model
   */
  readonly fields: CommentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Comment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CommentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    video<T extends VideoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, VideoDefaultArgs<ExtArgs>>): Prisma__VideoClient<$Result.GetResult<Prisma.$VideoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Comment model
   */
  interface CommentFieldRefs {
    readonly id: FieldRef<"Comment", 'Int'>
    readonly content: FieldRef<"Comment", 'String'>
    readonly userId: FieldRef<"Comment", 'String'>
    readonly videoId: FieldRef<"Comment", 'Int'>
    readonly createdAt: FieldRef<"Comment", 'DateTime'>
    readonly updatedAt: FieldRef<"Comment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Comment findUnique
   */
  export type CommentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * Filter, which Comment to fetch.
     */
    where: CommentWhereUniqueInput
  }

  /**
   * Comment findUniqueOrThrow
   */
  export type CommentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * Filter, which Comment to fetch.
     */
    where: CommentWhereUniqueInput
  }

  /**
   * Comment findFirst
   */
  export type CommentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * Filter, which Comment to fetch.
     */
    where?: CommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Comments to fetch.
     */
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Comments.
     */
    cursor?: CommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Comments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Comments.
     */
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * Comment findFirstOrThrow
   */
  export type CommentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * Filter, which Comment to fetch.
     */
    where?: CommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Comments to fetch.
     */
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Comments.
     */
    cursor?: CommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Comments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Comments.
     */
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * Comment findMany
   */
  export type CommentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * Filter, which Comments to fetch.
     */
    where?: CommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Comments to fetch.
     */
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Comments.
     */
    cursor?: CommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Comments.
     */
    skip?: number
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * Comment create
   */
  export type CommentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * The data needed to create a Comment.
     */
    data: XOR<CommentCreateInput, CommentUncheckedCreateInput>
  }

  /**
   * Comment createMany
   */
  export type CommentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Comments.
     */
    data: CommentCreateManyInput | CommentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Comment createManyAndReturn
   */
  export type CommentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * The data used to create many Comments.
     */
    data: CommentCreateManyInput | CommentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Comment update
   */
  export type CommentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * The data needed to update a Comment.
     */
    data: XOR<CommentUpdateInput, CommentUncheckedUpdateInput>
    /**
     * Choose, which Comment to update.
     */
    where: CommentWhereUniqueInput
  }

  /**
   * Comment updateMany
   */
  export type CommentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Comments.
     */
    data: XOR<CommentUpdateManyMutationInput, CommentUncheckedUpdateManyInput>
    /**
     * Filter which Comments to update
     */
    where?: CommentWhereInput
    /**
     * Limit how many Comments to update.
     */
    limit?: number
  }

  /**
   * Comment updateManyAndReturn
   */
  export type CommentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * The data used to update Comments.
     */
    data: XOR<CommentUpdateManyMutationInput, CommentUncheckedUpdateManyInput>
    /**
     * Filter which Comments to update
     */
    where?: CommentWhereInput
    /**
     * Limit how many Comments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Comment upsert
   */
  export type CommentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * The filter to search for the Comment to update in case it exists.
     */
    where: CommentWhereUniqueInput
    /**
     * In case the Comment found by the `where` argument doesn't exist, create a new Comment with this data.
     */
    create: XOR<CommentCreateInput, CommentUncheckedCreateInput>
    /**
     * In case the Comment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CommentUpdateInput, CommentUncheckedUpdateInput>
  }

  /**
   * Comment delete
   */
  export type CommentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * Filter which Comment to delete.
     */
    where: CommentWhereUniqueInput
  }

  /**
   * Comment deleteMany
   */
  export type CommentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Comments to delete
     */
    where?: CommentWhereInput
    /**
     * Limit how many Comments to delete.
     */
    limit?: number
  }

  /**
   * Comment without action
   */
  export type CommentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
  }


  /**
   * Model Like
   */

  export type AggregateLike = {
    _count: LikeCountAggregateOutputType | null
    _avg: LikeAvgAggregateOutputType | null
    _sum: LikeSumAggregateOutputType | null
    _min: LikeMinAggregateOutputType | null
    _max: LikeMaxAggregateOutputType | null
  }

  export type LikeAvgAggregateOutputType = {
    id: number | null
    videoId: number | null
  }

  export type LikeSumAggregateOutputType = {
    id: number | null
    videoId: number | null
  }

  export type LikeMinAggregateOutputType = {
    id: number | null
    userId: string | null
    videoId: number | null
    createdAt: Date | null
  }

  export type LikeMaxAggregateOutputType = {
    id: number | null
    userId: string | null
    videoId: number | null
    createdAt: Date | null
  }

  export type LikeCountAggregateOutputType = {
    id: number
    userId: number
    videoId: number
    createdAt: number
    _all: number
  }


  export type LikeAvgAggregateInputType = {
    id?: true
    videoId?: true
  }

  export type LikeSumAggregateInputType = {
    id?: true
    videoId?: true
  }

  export type LikeMinAggregateInputType = {
    id?: true
    userId?: true
    videoId?: true
    createdAt?: true
  }

  export type LikeMaxAggregateInputType = {
    id?: true
    userId?: true
    videoId?: true
    createdAt?: true
  }

  export type LikeCountAggregateInputType = {
    id?: true
    userId?: true
    videoId?: true
    createdAt?: true
    _all?: true
  }

  export type LikeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Like to aggregate.
     */
    where?: LikeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Likes to fetch.
     */
    orderBy?: LikeOrderByWithRelationInput | LikeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LikeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Likes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Likes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Likes
    **/
    _count?: true | LikeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LikeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LikeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LikeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LikeMaxAggregateInputType
  }

  export type GetLikeAggregateType<T extends LikeAggregateArgs> = {
        [P in keyof T & keyof AggregateLike]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLike[P]>
      : GetScalarType<T[P], AggregateLike[P]>
  }




  export type LikeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LikeWhereInput
    orderBy?: LikeOrderByWithAggregationInput | LikeOrderByWithAggregationInput[]
    by: LikeScalarFieldEnum[] | LikeScalarFieldEnum
    having?: LikeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LikeCountAggregateInputType | true
    _avg?: LikeAvgAggregateInputType
    _sum?: LikeSumAggregateInputType
    _min?: LikeMinAggregateInputType
    _max?: LikeMaxAggregateInputType
  }

  export type LikeGroupByOutputType = {
    id: number
    userId: string
    videoId: number
    createdAt: Date
    _count: LikeCountAggregateOutputType | null
    _avg: LikeAvgAggregateOutputType | null
    _sum: LikeSumAggregateOutputType | null
    _min: LikeMinAggregateOutputType | null
    _max: LikeMaxAggregateOutputType | null
  }

  type GetLikeGroupByPayload<T extends LikeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LikeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LikeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LikeGroupByOutputType[P]>
            : GetScalarType<T[P], LikeGroupByOutputType[P]>
        }
      >
    >


  export type LikeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    videoId?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    video?: boolean | VideoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["like"]>

  export type LikeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    videoId?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    video?: boolean | VideoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["like"]>

  export type LikeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    videoId?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    video?: boolean | VideoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["like"]>

  export type LikeSelectScalar = {
    id?: boolean
    userId?: boolean
    videoId?: boolean
    createdAt?: boolean
  }

  export type LikeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "videoId" | "createdAt", ExtArgs["result"]["like"]>
  export type LikeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    video?: boolean | VideoDefaultArgs<ExtArgs>
  }
  export type LikeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    video?: boolean | VideoDefaultArgs<ExtArgs>
  }
  export type LikeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    video?: boolean | VideoDefaultArgs<ExtArgs>
  }

  export type $LikePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Like"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      video: Prisma.$VideoPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: string
      videoId: number
      createdAt: Date
    }, ExtArgs["result"]["like"]>
    composites: {}
  }

  type LikeGetPayload<S extends boolean | null | undefined | LikeDefaultArgs> = $Result.GetResult<Prisma.$LikePayload, S>

  type LikeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LikeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LikeCountAggregateInputType | true
    }

  export interface LikeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Like'], meta: { name: 'Like' } }
    /**
     * Find zero or one Like that matches the filter.
     * @param {LikeFindUniqueArgs} args - Arguments to find a Like
     * @example
     * // Get one Like
     * const like = await prisma.like.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LikeFindUniqueArgs>(args: SelectSubset<T, LikeFindUniqueArgs<ExtArgs>>): Prisma__LikeClient<$Result.GetResult<Prisma.$LikePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Like that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LikeFindUniqueOrThrowArgs} args - Arguments to find a Like
     * @example
     * // Get one Like
     * const like = await prisma.like.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LikeFindUniqueOrThrowArgs>(args: SelectSubset<T, LikeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LikeClient<$Result.GetResult<Prisma.$LikePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Like that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LikeFindFirstArgs} args - Arguments to find a Like
     * @example
     * // Get one Like
     * const like = await prisma.like.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LikeFindFirstArgs>(args?: SelectSubset<T, LikeFindFirstArgs<ExtArgs>>): Prisma__LikeClient<$Result.GetResult<Prisma.$LikePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Like that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LikeFindFirstOrThrowArgs} args - Arguments to find a Like
     * @example
     * // Get one Like
     * const like = await prisma.like.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LikeFindFirstOrThrowArgs>(args?: SelectSubset<T, LikeFindFirstOrThrowArgs<ExtArgs>>): Prisma__LikeClient<$Result.GetResult<Prisma.$LikePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Likes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LikeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Likes
     * const likes = await prisma.like.findMany()
     * 
     * // Get first 10 Likes
     * const likes = await prisma.like.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const likeWithIdOnly = await prisma.like.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LikeFindManyArgs>(args?: SelectSubset<T, LikeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LikePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Like.
     * @param {LikeCreateArgs} args - Arguments to create a Like.
     * @example
     * // Create one Like
     * const Like = await prisma.like.create({
     *   data: {
     *     // ... data to create a Like
     *   }
     * })
     * 
     */
    create<T extends LikeCreateArgs>(args: SelectSubset<T, LikeCreateArgs<ExtArgs>>): Prisma__LikeClient<$Result.GetResult<Prisma.$LikePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Likes.
     * @param {LikeCreateManyArgs} args - Arguments to create many Likes.
     * @example
     * // Create many Likes
     * const like = await prisma.like.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LikeCreateManyArgs>(args?: SelectSubset<T, LikeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Likes and returns the data saved in the database.
     * @param {LikeCreateManyAndReturnArgs} args - Arguments to create many Likes.
     * @example
     * // Create many Likes
     * const like = await prisma.like.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Likes and only return the `id`
     * const likeWithIdOnly = await prisma.like.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LikeCreateManyAndReturnArgs>(args?: SelectSubset<T, LikeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LikePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Like.
     * @param {LikeDeleteArgs} args - Arguments to delete one Like.
     * @example
     * // Delete one Like
     * const Like = await prisma.like.delete({
     *   where: {
     *     // ... filter to delete one Like
     *   }
     * })
     * 
     */
    delete<T extends LikeDeleteArgs>(args: SelectSubset<T, LikeDeleteArgs<ExtArgs>>): Prisma__LikeClient<$Result.GetResult<Prisma.$LikePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Like.
     * @param {LikeUpdateArgs} args - Arguments to update one Like.
     * @example
     * // Update one Like
     * const like = await prisma.like.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LikeUpdateArgs>(args: SelectSubset<T, LikeUpdateArgs<ExtArgs>>): Prisma__LikeClient<$Result.GetResult<Prisma.$LikePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Likes.
     * @param {LikeDeleteManyArgs} args - Arguments to filter Likes to delete.
     * @example
     * // Delete a few Likes
     * const { count } = await prisma.like.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LikeDeleteManyArgs>(args?: SelectSubset<T, LikeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Likes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LikeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Likes
     * const like = await prisma.like.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LikeUpdateManyArgs>(args: SelectSubset<T, LikeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Likes and returns the data updated in the database.
     * @param {LikeUpdateManyAndReturnArgs} args - Arguments to update many Likes.
     * @example
     * // Update many Likes
     * const like = await prisma.like.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Likes and only return the `id`
     * const likeWithIdOnly = await prisma.like.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LikeUpdateManyAndReturnArgs>(args: SelectSubset<T, LikeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LikePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Like.
     * @param {LikeUpsertArgs} args - Arguments to update or create a Like.
     * @example
     * // Update or create a Like
     * const like = await prisma.like.upsert({
     *   create: {
     *     // ... data to create a Like
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Like we want to update
     *   }
     * })
     */
    upsert<T extends LikeUpsertArgs>(args: SelectSubset<T, LikeUpsertArgs<ExtArgs>>): Prisma__LikeClient<$Result.GetResult<Prisma.$LikePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Likes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LikeCountArgs} args - Arguments to filter Likes to count.
     * @example
     * // Count the number of Likes
     * const count = await prisma.like.count({
     *   where: {
     *     // ... the filter for the Likes we want to count
     *   }
     * })
    **/
    count<T extends LikeCountArgs>(
      args?: Subset<T, LikeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LikeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Like.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LikeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LikeAggregateArgs>(args: Subset<T, LikeAggregateArgs>): Prisma.PrismaPromise<GetLikeAggregateType<T>>

    /**
     * Group by Like.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LikeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LikeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LikeGroupByArgs['orderBy'] }
        : { orderBy?: LikeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LikeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLikeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Like model
   */
  readonly fields: LikeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Like.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LikeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    video<T extends VideoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, VideoDefaultArgs<ExtArgs>>): Prisma__VideoClient<$Result.GetResult<Prisma.$VideoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Like model
   */
  interface LikeFieldRefs {
    readonly id: FieldRef<"Like", 'Int'>
    readonly userId: FieldRef<"Like", 'String'>
    readonly videoId: FieldRef<"Like", 'Int'>
    readonly createdAt: FieldRef<"Like", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Like findUnique
   */
  export type LikeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Like
     */
    select?: LikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Like
     */
    omit?: LikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikeInclude<ExtArgs> | null
    /**
     * Filter, which Like to fetch.
     */
    where: LikeWhereUniqueInput
  }

  /**
   * Like findUniqueOrThrow
   */
  export type LikeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Like
     */
    select?: LikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Like
     */
    omit?: LikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikeInclude<ExtArgs> | null
    /**
     * Filter, which Like to fetch.
     */
    where: LikeWhereUniqueInput
  }

  /**
   * Like findFirst
   */
  export type LikeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Like
     */
    select?: LikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Like
     */
    omit?: LikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikeInclude<ExtArgs> | null
    /**
     * Filter, which Like to fetch.
     */
    where?: LikeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Likes to fetch.
     */
    orderBy?: LikeOrderByWithRelationInput | LikeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Likes.
     */
    cursor?: LikeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Likes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Likes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Likes.
     */
    distinct?: LikeScalarFieldEnum | LikeScalarFieldEnum[]
  }

  /**
   * Like findFirstOrThrow
   */
  export type LikeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Like
     */
    select?: LikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Like
     */
    omit?: LikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikeInclude<ExtArgs> | null
    /**
     * Filter, which Like to fetch.
     */
    where?: LikeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Likes to fetch.
     */
    orderBy?: LikeOrderByWithRelationInput | LikeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Likes.
     */
    cursor?: LikeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Likes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Likes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Likes.
     */
    distinct?: LikeScalarFieldEnum | LikeScalarFieldEnum[]
  }

  /**
   * Like findMany
   */
  export type LikeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Like
     */
    select?: LikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Like
     */
    omit?: LikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikeInclude<ExtArgs> | null
    /**
     * Filter, which Likes to fetch.
     */
    where?: LikeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Likes to fetch.
     */
    orderBy?: LikeOrderByWithRelationInput | LikeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Likes.
     */
    cursor?: LikeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Likes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Likes.
     */
    skip?: number
    distinct?: LikeScalarFieldEnum | LikeScalarFieldEnum[]
  }

  /**
   * Like create
   */
  export type LikeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Like
     */
    select?: LikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Like
     */
    omit?: LikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikeInclude<ExtArgs> | null
    /**
     * The data needed to create a Like.
     */
    data: XOR<LikeCreateInput, LikeUncheckedCreateInput>
  }

  /**
   * Like createMany
   */
  export type LikeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Likes.
     */
    data: LikeCreateManyInput | LikeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Like createManyAndReturn
   */
  export type LikeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Like
     */
    select?: LikeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Like
     */
    omit?: LikeOmit<ExtArgs> | null
    /**
     * The data used to create many Likes.
     */
    data: LikeCreateManyInput | LikeCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Like update
   */
  export type LikeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Like
     */
    select?: LikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Like
     */
    omit?: LikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikeInclude<ExtArgs> | null
    /**
     * The data needed to update a Like.
     */
    data: XOR<LikeUpdateInput, LikeUncheckedUpdateInput>
    /**
     * Choose, which Like to update.
     */
    where: LikeWhereUniqueInput
  }

  /**
   * Like updateMany
   */
  export type LikeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Likes.
     */
    data: XOR<LikeUpdateManyMutationInput, LikeUncheckedUpdateManyInput>
    /**
     * Filter which Likes to update
     */
    where?: LikeWhereInput
    /**
     * Limit how many Likes to update.
     */
    limit?: number
  }

  /**
   * Like updateManyAndReturn
   */
  export type LikeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Like
     */
    select?: LikeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Like
     */
    omit?: LikeOmit<ExtArgs> | null
    /**
     * The data used to update Likes.
     */
    data: XOR<LikeUpdateManyMutationInput, LikeUncheckedUpdateManyInput>
    /**
     * Filter which Likes to update
     */
    where?: LikeWhereInput
    /**
     * Limit how many Likes to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikeIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Like upsert
   */
  export type LikeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Like
     */
    select?: LikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Like
     */
    omit?: LikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikeInclude<ExtArgs> | null
    /**
     * The filter to search for the Like to update in case it exists.
     */
    where: LikeWhereUniqueInput
    /**
     * In case the Like found by the `where` argument doesn't exist, create a new Like with this data.
     */
    create: XOR<LikeCreateInput, LikeUncheckedCreateInput>
    /**
     * In case the Like was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LikeUpdateInput, LikeUncheckedUpdateInput>
  }

  /**
   * Like delete
   */
  export type LikeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Like
     */
    select?: LikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Like
     */
    omit?: LikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikeInclude<ExtArgs> | null
    /**
     * Filter which Like to delete.
     */
    where: LikeWhereUniqueInput
  }

  /**
   * Like deleteMany
   */
  export type LikeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Likes to delete
     */
    where?: LikeWhereInput
    /**
     * Limit how many Likes to delete.
     */
    limit?: number
  }

  /**
   * Like without action
   */
  export type LikeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Like
     */
    select?: LikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Like
     */
    omit?: LikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikeInclude<ExtArgs> | null
  }


  /**
   * Model VideoView
   */

  export type AggregateVideoView = {
    _count: VideoViewCountAggregateOutputType | null
    _avg: VideoViewAvgAggregateOutputType | null
    _sum: VideoViewSumAggregateOutputType | null
    _min: VideoViewMinAggregateOutputType | null
    _max: VideoViewMaxAggregateOutputType | null
  }

  export type VideoViewAvgAggregateOutputType = {
    id: number | null
    videoId: number | null
  }

  export type VideoViewSumAggregateOutputType = {
    id: number | null
    videoId: number | null
  }

  export type VideoViewMinAggregateOutputType = {
    id: number | null
    userId: string | null
    videoId: number | null
    ipAddress: string | null
    userAgent: string | null
    createdAt: Date | null
  }

  export type VideoViewMaxAggregateOutputType = {
    id: number | null
    userId: string | null
    videoId: number | null
    ipAddress: string | null
    userAgent: string | null
    createdAt: Date | null
  }

  export type VideoViewCountAggregateOutputType = {
    id: number
    userId: number
    videoId: number
    ipAddress: number
    userAgent: number
    createdAt: number
    _all: number
  }


  export type VideoViewAvgAggregateInputType = {
    id?: true
    videoId?: true
  }

  export type VideoViewSumAggregateInputType = {
    id?: true
    videoId?: true
  }

  export type VideoViewMinAggregateInputType = {
    id?: true
    userId?: true
    videoId?: true
    ipAddress?: true
    userAgent?: true
    createdAt?: true
  }

  export type VideoViewMaxAggregateInputType = {
    id?: true
    userId?: true
    videoId?: true
    ipAddress?: true
    userAgent?: true
    createdAt?: true
  }

  export type VideoViewCountAggregateInputType = {
    id?: true
    userId?: true
    videoId?: true
    ipAddress?: true
    userAgent?: true
    createdAt?: true
    _all?: true
  }

  export type VideoViewAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VideoView to aggregate.
     */
    where?: VideoViewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VideoViews to fetch.
     */
    orderBy?: VideoViewOrderByWithRelationInput | VideoViewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VideoViewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VideoViews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VideoViews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned VideoViews
    **/
    _count?: true | VideoViewCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: VideoViewAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: VideoViewSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VideoViewMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VideoViewMaxAggregateInputType
  }

  export type GetVideoViewAggregateType<T extends VideoViewAggregateArgs> = {
        [P in keyof T & keyof AggregateVideoView]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVideoView[P]>
      : GetScalarType<T[P], AggregateVideoView[P]>
  }




  export type VideoViewGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VideoViewWhereInput
    orderBy?: VideoViewOrderByWithAggregationInput | VideoViewOrderByWithAggregationInput[]
    by: VideoViewScalarFieldEnum[] | VideoViewScalarFieldEnum
    having?: VideoViewScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VideoViewCountAggregateInputType | true
    _avg?: VideoViewAvgAggregateInputType
    _sum?: VideoViewSumAggregateInputType
    _min?: VideoViewMinAggregateInputType
    _max?: VideoViewMaxAggregateInputType
  }

  export type VideoViewGroupByOutputType = {
    id: number
    userId: string | null
    videoId: number
    ipAddress: string | null
    userAgent: string | null
    createdAt: Date
    _count: VideoViewCountAggregateOutputType | null
    _avg: VideoViewAvgAggregateOutputType | null
    _sum: VideoViewSumAggregateOutputType | null
    _min: VideoViewMinAggregateOutputType | null
    _max: VideoViewMaxAggregateOutputType | null
  }

  type GetVideoViewGroupByPayload<T extends VideoViewGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VideoViewGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VideoViewGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VideoViewGroupByOutputType[P]>
            : GetScalarType<T[P], VideoViewGroupByOutputType[P]>
        }
      >
    >


  export type VideoViewSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    videoId?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    createdAt?: boolean
    user?: boolean | VideoView$userArgs<ExtArgs>
    video?: boolean | VideoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["videoView"]>

  export type VideoViewSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    videoId?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    createdAt?: boolean
    user?: boolean | VideoView$userArgs<ExtArgs>
    video?: boolean | VideoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["videoView"]>

  export type VideoViewSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    videoId?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    createdAt?: boolean
    user?: boolean | VideoView$userArgs<ExtArgs>
    video?: boolean | VideoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["videoView"]>

  export type VideoViewSelectScalar = {
    id?: boolean
    userId?: boolean
    videoId?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    createdAt?: boolean
  }

  export type VideoViewOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "videoId" | "ipAddress" | "userAgent" | "createdAt", ExtArgs["result"]["videoView"]>
  export type VideoViewInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | VideoView$userArgs<ExtArgs>
    video?: boolean | VideoDefaultArgs<ExtArgs>
  }
  export type VideoViewIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | VideoView$userArgs<ExtArgs>
    video?: boolean | VideoDefaultArgs<ExtArgs>
  }
  export type VideoViewIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | VideoView$userArgs<ExtArgs>
    video?: boolean | VideoDefaultArgs<ExtArgs>
  }

  export type $VideoViewPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "VideoView"
    objects: {
      user: Prisma.$UserPayload<ExtArgs> | null
      video: Prisma.$VideoPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: string | null
      videoId: number
      ipAddress: string | null
      userAgent: string | null
      createdAt: Date
    }, ExtArgs["result"]["videoView"]>
    composites: {}
  }

  type VideoViewGetPayload<S extends boolean | null | undefined | VideoViewDefaultArgs> = $Result.GetResult<Prisma.$VideoViewPayload, S>

  type VideoViewCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VideoViewFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VideoViewCountAggregateInputType | true
    }

  export interface VideoViewDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['VideoView'], meta: { name: 'VideoView' } }
    /**
     * Find zero or one VideoView that matches the filter.
     * @param {VideoViewFindUniqueArgs} args - Arguments to find a VideoView
     * @example
     * // Get one VideoView
     * const videoView = await prisma.videoView.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VideoViewFindUniqueArgs>(args: SelectSubset<T, VideoViewFindUniqueArgs<ExtArgs>>): Prisma__VideoViewClient<$Result.GetResult<Prisma.$VideoViewPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one VideoView that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VideoViewFindUniqueOrThrowArgs} args - Arguments to find a VideoView
     * @example
     * // Get one VideoView
     * const videoView = await prisma.videoView.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VideoViewFindUniqueOrThrowArgs>(args: SelectSubset<T, VideoViewFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VideoViewClient<$Result.GetResult<Prisma.$VideoViewPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VideoView that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VideoViewFindFirstArgs} args - Arguments to find a VideoView
     * @example
     * // Get one VideoView
     * const videoView = await prisma.videoView.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VideoViewFindFirstArgs>(args?: SelectSubset<T, VideoViewFindFirstArgs<ExtArgs>>): Prisma__VideoViewClient<$Result.GetResult<Prisma.$VideoViewPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VideoView that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VideoViewFindFirstOrThrowArgs} args - Arguments to find a VideoView
     * @example
     * // Get one VideoView
     * const videoView = await prisma.videoView.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VideoViewFindFirstOrThrowArgs>(args?: SelectSubset<T, VideoViewFindFirstOrThrowArgs<ExtArgs>>): Prisma__VideoViewClient<$Result.GetResult<Prisma.$VideoViewPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more VideoViews that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VideoViewFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all VideoViews
     * const videoViews = await prisma.videoView.findMany()
     * 
     * // Get first 10 VideoViews
     * const videoViews = await prisma.videoView.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const videoViewWithIdOnly = await prisma.videoView.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VideoViewFindManyArgs>(args?: SelectSubset<T, VideoViewFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VideoViewPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a VideoView.
     * @param {VideoViewCreateArgs} args - Arguments to create a VideoView.
     * @example
     * // Create one VideoView
     * const VideoView = await prisma.videoView.create({
     *   data: {
     *     // ... data to create a VideoView
     *   }
     * })
     * 
     */
    create<T extends VideoViewCreateArgs>(args: SelectSubset<T, VideoViewCreateArgs<ExtArgs>>): Prisma__VideoViewClient<$Result.GetResult<Prisma.$VideoViewPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many VideoViews.
     * @param {VideoViewCreateManyArgs} args - Arguments to create many VideoViews.
     * @example
     * // Create many VideoViews
     * const videoView = await prisma.videoView.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VideoViewCreateManyArgs>(args?: SelectSubset<T, VideoViewCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many VideoViews and returns the data saved in the database.
     * @param {VideoViewCreateManyAndReturnArgs} args - Arguments to create many VideoViews.
     * @example
     * // Create many VideoViews
     * const videoView = await prisma.videoView.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many VideoViews and only return the `id`
     * const videoViewWithIdOnly = await prisma.videoView.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VideoViewCreateManyAndReturnArgs>(args?: SelectSubset<T, VideoViewCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VideoViewPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a VideoView.
     * @param {VideoViewDeleteArgs} args - Arguments to delete one VideoView.
     * @example
     * // Delete one VideoView
     * const VideoView = await prisma.videoView.delete({
     *   where: {
     *     // ... filter to delete one VideoView
     *   }
     * })
     * 
     */
    delete<T extends VideoViewDeleteArgs>(args: SelectSubset<T, VideoViewDeleteArgs<ExtArgs>>): Prisma__VideoViewClient<$Result.GetResult<Prisma.$VideoViewPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one VideoView.
     * @param {VideoViewUpdateArgs} args - Arguments to update one VideoView.
     * @example
     * // Update one VideoView
     * const videoView = await prisma.videoView.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VideoViewUpdateArgs>(args: SelectSubset<T, VideoViewUpdateArgs<ExtArgs>>): Prisma__VideoViewClient<$Result.GetResult<Prisma.$VideoViewPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more VideoViews.
     * @param {VideoViewDeleteManyArgs} args - Arguments to filter VideoViews to delete.
     * @example
     * // Delete a few VideoViews
     * const { count } = await prisma.videoView.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VideoViewDeleteManyArgs>(args?: SelectSubset<T, VideoViewDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VideoViews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VideoViewUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many VideoViews
     * const videoView = await prisma.videoView.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VideoViewUpdateManyArgs>(args: SelectSubset<T, VideoViewUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VideoViews and returns the data updated in the database.
     * @param {VideoViewUpdateManyAndReturnArgs} args - Arguments to update many VideoViews.
     * @example
     * // Update many VideoViews
     * const videoView = await prisma.videoView.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more VideoViews and only return the `id`
     * const videoViewWithIdOnly = await prisma.videoView.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VideoViewUpdateManyAndReturnArgs>(args: SelectSubset<T, VideoViewUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VideoViewPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one VideoView.
     * @param {VideoViewUpsertArgs} args - Arguments to update or create a VideoView.
     * @example
     * // Update or create a VideoView
     * const videoView = await prisma.videoView.upsert({
     *   create: {
     *     // ... data to create a VideoView
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the VideoView we want to update
     *   }
     * })
     */
    upsert<T extends VideoViewUpsertArgs>(args: SelectSubset<T, VideoViewUpsertArgs<ExtArgs>>): Prisma__VideoViewClient<$Result.GetResult<Prisma.$VideoViewPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of VideoViews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VideoViewCountArgs} args - Arguments to filter VideoViews to count.
     * @example
     * // Count the number of VideoViews
     * const count = await prisma.videoView.count({
     *   where: {
     *     // ... the filter for the VideoViews we want to count
     *   }
     * })
    **/
    count<T extends VideoViewCountArgs>(
      args?: Subset<T, VideoViewCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VideoViewCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a VideoView.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VideoViewAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VideoViewAggregateArgs>(args: Subset<T, VideoViewAggregateArgs>): Prisma.PrismaPromise<GetVideoViewAggregateType<T>>

    /**
     * Group by VideoView.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VideoViewGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VideoViewGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VideoViewGroupByArgs['orderBy'] }
        : { orderBy?: VideoViewGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VideoViewGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVideoViewGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the VideoView model
   */
  readonly fields: VideoViewFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for VideoView.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VideoViewClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends VideoView$userArgs<ExtArgs> = {}>(args?: Subset<T, VideoView$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    video<T extends VideoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, VideoDefaultArgs<ExtArgs>>): Prisma__VideoClient<$Result.GetResult<Prisma.$VideoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the VideoView model
   */
  interface VideoViewFieldRefs {
    readonly id: FieldRef<"VideoView", 'Int'>
    readonly userId: FieldRef<"VideoView", 'String'>
    readonly videoId: FieldRef<"VideoView", 'Int'>
    readonly ipAddress: FieldRef<"VideoView", 'String'>
    readonly userAgent: FieldRef<"VideoView", 'String'>
    readonly createdAt: FieldRef<"VideoView", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * VideoView findUnique
   */
  export type VideoViewFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VideoView
     */
    select?: VideoViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VideoView
     */
    omit?: VideoViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VideoViewInclude<ExtArgs> | null
    /**
     * Filter, which VideoView to fetch.
     */
    where: VideoViewWhereUniqueInput
  }

  /**
   * VideoView findUniqueOrThrow
   */
  export type VideoViewFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VideoView
     */
    select?: VideoViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VideoView
     */
    omit?: VideoViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VideoViewInclude<ExtArgs> | null
    /**
     * Filter, which VideoView to fetch.
     */
    where: VideoViewWhereUniqueInput
  }

  /**
   * VideoView findFirst
   */
  export type VideoViewFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VideoView
     */
    select?: VideoViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VideoView
     */
    omit?: VideoViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VideoViewInclude<ExtArgs> | null
    /**
     * Filter, which VideoView to fetch.
     */
    where?: VideoViewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VideoViews to fetch.
     */
    orderBy?: VideoViewOrderByWithRelationInput | VideoViewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VideoViews.
     */
    cursor?: VideoViewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VideoViews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VideoViews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VideoViews.
     */
    distinct?: VideoViewScalarFieldEnum | VideoViewScalarFieldEnum[]
  }

  /**
   * VideoView findFirstOrThrow
   */
  export type VideoViewFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VideoView
     */
    select?: VideoViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VideoView
     */
    omit?: VideoViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VideoViewInclude<ExtArgs> | null
    /**
     * Filter, which VideoView to fetch.
     */
    where?: VideoViewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VideoViews to fetch.
     */
    orderBy?: VideoViewOrderByWithRelationInput | VideoViewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VideoViews.
     */
    cursor?: VideoViewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VideoViews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VideoViews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VideoViews.
     */
    distinct?: VideoViewScalarFieldEnum | VideoViewScalarFieldEnum[]
  }

  /**
   * VideoView findMany
   */
  export type VideoViewFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VideoView
     */
    select?: VideoViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VideoView
     */
    omit?: VideoViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VideoViewInclude<ExtArgs> | null
    /**
     * Filter, which VideoViews to fetch.
     */
    where?: VideoViewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VideoViews to fetch.
     */
    orderBy?: VideoViewOrderByWithRelationInput | VideoViewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing VideoViews.
     */
    cursor?: VideoViewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VideoViews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VideoViews.
     */
    skip?: number
    distinct?: VideoViewScalarFieldEnum | VideoViewScalarFieldEnum[]
  }

  /**
   * VideoView create
   */
  export type VideoViewCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VideoView
     */
    select?: VideoViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VideoView
     */
    omit?: VideoViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VideoViewInclude<ExtArgs> | null
    /**
     * The data needed to create a VideoView.
     */
    data: XOR<VideoViewCreateInput, VideoViewUncheckedCreateInput>
  }

  /**
   * VideoView createMany
   */
  export type VideoViewCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many VideoViews.
     */
    data: VideoViewCreateManyInput | VideoViewCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * VideoView createManyAndReturn
   */
  export type VideoViewCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VideoView
     */
    select?: VideoViewSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VideoView
     */
    omit?: VideoViewOmit<ExtArgs> | null
    /**
     * The data used to create many VideoViews.
     */
    data: VideoViewCreateManyInput | VideoViewCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VideoViewIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * VideoView update
   */
  export type VideoViewUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VideoView
     */
    select?: VideoViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VideoView
     */
    omit?: VideoViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VideoViewInclude<ExtArgs> | null
    /**
     * The data needed to update a VideoView.
     */
    data: XOR<VideoViewUpdateInput, VideoViewUncheckedUpdateInput>
    /**
     * Choose, which VideoView to update.
     */
    where: VideoViewWhereUniqueInput
  }

  /**
   * VideoView updateMany
   */
  export type VideoViewUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update VideoViews.
     */
    data: XOR<VideoViewUpdateManyMutationInput, VideoViewUncheckedUpdateManyInput>
    /**
     * Filter which VideoViews to update
     */
    where?: VideoViewWhereInput
    /**
     * Limit how many VideoViews to update.
     */
    limit?: number
  }

  /**
   * VideoView updateManyAndReturn
   */
  export type VideoViewUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VideoView
     */
    select?: VideoViewSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VideoView
     */
    omit?: VideoViewOmit<ExtArgs> | null
    /**
     * The data used to update VideoViews.
     */
    data: XOR<VideoViewUpdateManyMutationInput, VideoViewUncheckedUpdateManyInput>
    /**
     * Filter which VideoViews to update
     */
    where?: VideoViewWhereInput
    /**
     * Limit how many VideoViews to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VideoViewIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * VideoView upsert
   */
  export type VideoViewUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VideoView
     */
    select?: VideoViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VideoView
     */
    omit?: VideoViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VideoViewInclude<ExtArgs> | null
    /**
     * The filter to search for the VideoView to update in case it exists.
     */
    where: VideoViewWhereUniqueInput
    /**
     * In case the VideoView found by the `where` argument doesn't exist, create a new VideoView with this data.
     */
    create: XOR<VideoViewCreateInput, VideoViewUncheckedCreateInput>
    /**
     * In case the VideoView was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VideoViewUpdateInput, VideoViewUncheckedUpdateInput>
  }

  /**
   * VideoView delete
   */
  export type VideoViewDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VideoView
     */
    select?: VideoViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VideoView
     */
    omit?: VideoViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VideoViewInclude<ExtArgs> | null
    /**
     * Filter which VideoView to delete.
     */
    where: VideoViewWhereUniqueInput
  }

  /**
   * VideoView deleteMany
   */
  export type VideoViewDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VideoViews to delete
     */
    where?: VideoViewWhereInput
    /**
     * Limit how many VideoViews to delete.
     */
    limit?: number
  }

  /**
   * VideoView.user
   */
  export type VideoView$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * VideoView without action
   */
  export type VideoViewDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VideoView
     */
    select?: VideoViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VideoView
     */
    omit?: VideoViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VideoViewInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    emailVerified: 'emailVerified',
    name: 'name',
    username: 'username',
    bio: 'bio',
    profileImageUrl: 'profileImageUrl',
    coverImageUrl: 'coverImageUrl',
    isCreator: 'isCreator',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const FollowerScalarFieldEnum: {
    id: 'id',
    followerId: 'followerId',
    followingId: 'followingId',
    createdAt: 'createdAt'
  };

  export type FollowerScalarFieldEnum = (typeof FollowerScalarFieldEnum)[keyof typeof FollowerScalarFieldEnum]


  export const VideoScalarFieldEnum: {
    id: 'id',
    user_id: 'user_id',
    title: 'title',
    description: 'description',
    assetId: 'assetId',
    uploadId: 'uploadId',
    playbackId: 'playbackId',
    status: 'status',
    duration: 'duration',
    aspectRatio: 'aspectRatio',
    thumbnailUrl: 'thumbnailUrl',
    videoUrl: 'videoUrl',
    isPublished: 'isPublished',
    isPremium: 'isPremium',
    price: 'price',
    viewCount: 'viewCount',
    likeCount: 'likeCount',
    commentCount: 'commentCount',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type VideoScalarFieldEnum = (typeof VideoScalarFieldEnum)[keyof typeof VideoScalarFieldEnum]


  export const VideoMetadataScalarFieldEnum: {
    id: 'id',
    videoId: 'videoId',
    filename: 'filename',
    fileSize: 'fileSize',
    mimeType: 'mimeType',
    width: 'width',
    height: 'height',
    frameRate: 'frameRate',
    bitrate: 'bitrate',
    originalUrl: 'originalUrl',
    uploadStatus: 'uploadStatus',
    error: 'error',
    metadata: 'metadata',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type VideoMetadataScalarFieldEnum = (typeof VideoMetadataScalarFieldEnum)[keyof typeof VideoMetadataScalarFieldEnum]


  export const CommentScalarFieldEnum: {
    id: 'id',
    content: 'content',
    userId: 'userId',
    videoId: 'videoId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CommentScalarFieldEnum = (typeof CommentScalarFieldEnum)[keyof typeof CommentScalarFieldEnum]


  export const LikeScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    videoId: 'videoId',
    createdAt: 'createdAt'
  };

  export type LikeScalarFieldEnum = (typeof LikeScalarFieldEnum)[keyof typeof LikeScalarFieldEnum]


  export const VideoViewScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    videoId: 'videoId',
    ipAddress: 'ipAddress',
    userAgent: 'userAgent',
    createdAt: 'createdAt'
  };

  export type VideoViewScalarFieldEnum = (typeof VideoViewScalarFieldEnum)[keyof typeof VideoViewScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    emailVerified?: BoolFilter<"User"> | boolean
    name?: StringNullableFilter<"User"> | string | null
    username?: StringNullableFilter<"User"> | string | null
    bio?: StringNullableFilter<"User"> | string | null
    profileImageUrl?: StringNullableFilter<"User"> | string | null
    coverImageUrl?: StringNullableFilter<"User"> | string | null
    isCreator?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    videos?: VideoListRelationFilter
    comments?: CommentListRelationFilter
    likes?: LikeListRelationFilter
    videoViews?: VideoViewListRelationFilter
    followers?: FollowerListRelationFilter
    following?: FollowerListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    name?: SortOrderInput | SortOrder
    username?: SortOrderInput | SortOrder
    bio?: SortOrderInput | SortOrder
    profileImageUrl?: SortOrderInput | SortOrder
    coverImageUrl?: SortOrderInput | SortOrder
    isCreator?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    videos?: VideoOrderByRelationAggregateInput
    comments?: CommentOrderByRelationAggregateInput
    likes?: LikeOrderByRelationAggregateInput
    videoViews?: VideoViewOrderByRelationAggregateInput
    followers?: FollowerOrderByRelationAggregateInput
    following?: FollowerOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    username?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    emailVerified?: BoolFilter<"User"> | boolean
    name?: StringNullableFilter<"User"> | string | null
    bio?: StringNullableFilter<"User"> | string | null
    profileImageUrl?: StringNullableFilter<"User"> | string | null
    coverImageUrl?: StringNullableFilter<"User"> | string | null
    isCreator?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    videos?: VideoListRelationFilter
    comments?: CommentListRelationFilter
    likes?: LikeListRelationFilter
    videoViews?: VideoViewListRelationFilter
    followers?: FollowerListRelationFilter
    following?: FollowerListRelationFilter
  }, "id" | "email" | "username">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    name?: SortOrderInput | SortOrder
    username?: SortOrderInput | SortOrder
    bio?: SortOrderInput | SortOrder
    profileImageUrl?: SortOrderInput | SortOrder
    coverImageUrl?: SortOrderInput | SortOrder
    isCreator?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    emailVerified?: BoolWithAggregatesFilter<"User"> | boolean
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    username?: StringNullableWithAggregatesFilter<"User"> | string | null
    bio?: StringNullableWithAggregatesFilter<"User"> | string | null
    profileImageUrl?: StringNullableWithAggregatesFilter<"User"> | string | null
    coverImageUrl?: StringNullableWithAggregatesFilter<"User"> | string | null
    isCreator?: BoolWithAggregatesFilter<"User"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type FollowerWhereInput = {
    AND?: FollowerWhereInput | FollowerWhereInput[]
    OR?: FollowerWhereInput[]
    NOT?: FollowerWhereInput | FollowerWhereInput[]
    id?: StringFilter<"Follower"> | string
    followerId?: StringFilter<"Follower"> | string
    followingId?: StringFilter<"Follower"> | string
    createdAt?: DateTimeFilter<"Follower"> | Date | string
    follower?: XOR<UserScalarRelationFilter, UserWhereInput>
    following?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type FollowerOrderByWithRelationInput = {
    id?: SortOrder
    followerId?: SortOrder
    followingId?: SortOrder
    createdAt?: SortOrder
    follower?: UserOrderByWithRelationInput
    following?: UserOrderByWithRelationInput
  }

  export type FollowerWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    uq_follower_following?: FollowerUq_follower_followingCompoundUniqueInput
    AND?: FollowerWhereInput | FollowerWhereInput[]
    OR?: FollowerWhereInput[]
    NOT?: FollowerWhereInput | FollowerWhereInput[]
    followerId?: StringFilter<"Follower"> | string
    followingId?: StringFilter<"Follower"> | string
    createdAt?: DateTimeFilter<"Follower"> | Date | string
    follower?: XOR<UserScalarRelationFilter, UserWhereInput>
    following?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "uq_follower_following">

  export type FollowerOrderByWithAggregationInput = {
    id?: SortOrder
    followerId?: SortOrder
    followingId?: SortOrder
    createdAt?: SortOrder
    _count?: FollowerCountOrderByAggregateInput
    _max?: FollowerMaxOrderByAggregateInput
    _min?: FollowerMinOrderByAggregateInput
  }

  export type FollowerScalarWhereWithAggregatesInput = {
    AND?: FollowerScalarWhereWithAggregatesInput | FollowerScalarWhereWithAggregatesInput[]
    OR?: FollowerScalarWhereWithAggregatesInput[]
    NOT?: FollowerScalarWhereWithAggregatesInput | FollowerScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Follower"> | string
    followerId?: StringWithAggregatesFilter<"Follower"> | string
    followingId?: StringWithAggregatesFilter<"Follower"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Follower"> | Date | string
  }

  export type VideoWhereInput = {
    AND?: VideoWhereInput | VideoWhereInput[]
    OR?: VideoWhereInput[]
    NOT?: VideoWhereInput | VideoWhereInput[]
    id?: IntFilter<"Video"> | number
    user_id?: StringFilter<"Video"> | string
    title?: StringFilter<"Video"> | string
    description?: StringNullableFilter<"Video"> | string | null
    assetId?: StringNullableFilter<"Video"> | string | null
    uploadId?: StringNullableFilter<"Video"> | string | null
    playbackId?: StringNullableFilter<"Video"> | string | null
    status?: StringFilter<"Video"> | string
    duration?: FloatNullableFilter<"Video"> | number | null
    aspectRatio?: StringNullableFilter<"Video"> | string | null
    thumbnailUrl?: StringNullableFilter<"Video"> | string | null
    videoUrl?: StringNullableFilter<"Video"> | string | null
    isPublished?: BoolFilter<"Video"> | boolean
    isPremium?: BoolFilter<"Video"> | boolean
    price?: FloatNullableFilter<"Video"> | number | null
    viewCount?: IntFilter<"Video"> | number
    likeCount?: IntFilter<"Video"> | number
    commentCount?: IntFilter<"Video"> | number
    createdAt?: DateTimeFilter<"Video"> | Date | string
    updatedAt?: DateTimeFilter<"Video"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    metadata?: XOR<VideoMetadataNullableScalarRelationFilter, VideoMetadataWhereInput> | null
    comments?: CommentListRelationFilter
    likes?: LikeListRelationFilter
    views?: VideoViewListRelationFilter
  }

  export type VideoOrderByWithRelationInput = {
    id?: SortOrder
    user_id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    assetId?: SortOrderInput | SortOrder
    uploadId?: SortOrderInput | SortOrder
    playbackId?: SortOrderInput | SortOrder
    status?: SortOrder
    duration?: SortOrderInput | SortOrder
    aspectRatio?: SortOrderInput | SortOrder
    thumbnailUrl?: SortOrderInput | SortOrder
    videoUrl?: SortOrderInput | SortOrder
    isPublished?: SortOrder
    isPremium?: SortOrder
    price?: SortOrderInput | SortOrder
    viewCount?: SortOrder
    likeCount?: SortOrder
    commentCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    metadata?: VideoMetadataOrderByWithRelationInput
    comments?: CommentOrderByRelationAggregateInput
    likes?: LikeOrderByRelationAggregateInput
    views?: VideoViewOrderByRelationAggregateInput
  }

  export type VideoWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    assetId?: string
    AND?: VideoWhereInput | VideoWhereInput[]
    OR?: VideoWhereInput[]
    NOT?: VideoWhereInput | VideoWhereInput[]
    user_id?: StringFilter<"Video"> | string
    title?: StringFilter<"Video"> | string
    description?: StringNullableFilter<"Video"> | string | null
    uploadId?: StringNullableFilter<"Video"> | string | null
    playbackId?: StringNullableFilter<"Video"> | string | null
    status?: StringFilter<"Video"> | string
    duration?: FloatNullableFilter<"Video"> | number | null
    aspectRatio?: StringNullableFilter<"Video"> | string | null
    thumbnailUrl?: StringNullableFilter<"Video"> | string | null
    videoUrl?: StringNullableFilter<"Video"> | string | null
    isPublished?: BoolFilter<"Video"> | boolean
    isPremium?: BoolFilter<"Video"> | boolean
    price?: FloatNullableFilter<"Video"> | number | null
    viewCount?: IntFilter<"Video"> | number
    likeCount?: IntFilter<"Video"> | number
    commentCount?: IntFilter<"Video"> | number
    createdAt?: DateTimeFilter<"Video"> | Date | string
    updatedAt?: DateTimeFilter<"Video"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    metadata?: XOR<VideoMetadataNullableScalarRelationFilter, VideoMetadataWhereInput> | null
    comments?: CommentListRelationFilter
    likes?: LikeListRelationFilter
    views?: VideoViewListRelationFilter
  }, "id" | "assetId">

  export type VideoOrderByWithAggregationInput = {
    id?: SortOrder
    user_id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    assetId?: SortOrderInput | SortOrder
    uploadId?: SortOrderInput | SortOrder
    playbackId?: SortOrderInput | SortOrder
    status?: SortOrder
    duration?: SortOrderInput | SortOrder
    aspectRatio?: SortOrderInput | SortOrder
    thumbnailUrl?: SortOrderInput | SortOrder
    videoUrl?: SortOrderInput | SortOrder
    isPublished?: SortOrder
    isPremium?: SortOrder
    price?: SortOrderInput | SortOrder
    viewCount?: SortOrder
    likeCount?: SortOrder
    commentCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: VideoCountOrderByAggregateInput
    _avg?: VideoAvgOrderByAggregateInput
    _max?: VideoMaxOrderByAggregateInput
    _min?: VideoMinOrderByAggregateInput
    _sum?: VideoSumOrderByAggregateInput
  }

  export type VideoScalarWhereWithAggregatesInput = {
    AND?: VideoScalarWhereWithAggregatesInput | VideoScalarWhereWithAggregatesInput[]
    OR?: VideoScalarWhereWithAggregatesInput[]
    NOT?: VideoScalarWhereWithAggregatesInput | VideoScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Video"> | number
    user_id?: StringWithAggregatesFilter<"Video"> | string
    title?: StringWithAggregatesFilter<"Video"> | string
    description?: StringNullableWithAggregatesFilter<"Video"> | string | null
    assetId?: StringNullableWithAggregatesFilter<"Video"> | string | null
    uploadId?: StringNullableWithAggregatesFilter<"Video"> | string | null
    playbackId?: StringNullableWithAggregatesFilter<"Video"> | string | null
    status?: StringWithAggregatesFilter<"Video"> | string
    duration?: FloatNullableWithAggregatesFilter<"Video"> | number | null
    aspectRatio?: StringNullableWithAggregatesFilter<"Video"> | string | null
    thumbnailUrl?: StringNullableWithAggregatesFilter<"Video"> | string | null
    videoUrl?: StringNullableWithAggregatesFilter<"Video"> | string | null
    isPublished?: BoolWithAggregatesFilter<"Video"> | boolean
    isPremium?: BoolWithAggregatesFilter<"Video"> | boolean
    price?: FloatNullableWithAggregatesFilter<"Video"> | number | null
    viewCount?: IntWithAggregatesFilter<"Video"> | number
    likeCount?: IntWithAggregatesFilter<"Video"> | number
    commentCount?: IntWithAggregatesFilter<"Video"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Video"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Video"> | Date | string
  }

  export type VideoMetadataWhereInput = {
    AND?: VideoMetadataWhereInput | VideoMetadataWhereInput[]
    OR?: VideoMetadataWhereInput[]
    NOT?: VideoMetadataWhereInput | VideoMetadataWhereInput[]
    id?: IntFilter<"VideoMetadata"> | number
    videoId?: IntFilter<"VideoMetadata"> | number
    filename?: StringNullableFilter<"VideoMetadata"> | string | null
    fileSize?: IntNullableFilter<"VideoMetadata"> | number | null
    mimeType?: StringNullableFilter<"VideoMetadata"> | string | null
    width?: IntNullableFilter<"VideoMetadata"> | number | null
    height?: IntNullableFilter<"VideoMetadata"> | number | null
    frameRate?: FloatNullableFilter<"VideoMetadata"> | number | null
    bitrate?: IntNullableFilter<"VideoMetadata"> | number | null
    originalUrl?: StringNullableFilter<"VideoMetadata"> | string | null
    uploadStatus?: StringNullableFilter<"VideoMetadata"> | string | null
    error?: StringNullableFilter<"VideoMetadata"> | string | null
    metadata?: JsonNullableFilter<"VideoMetadata">
    createdAt?: DateTimeFilter<"VideoMetadata"> | Date | string
    updatedAt?: DateTimeFilter<"VideoMetadata"> | Date | string
    video?: XOR<VideoScalarRelationFilter, VideoWhereInput>
  }

  export type VideoMetadataOrderByWithRelationInput = {
    id?: SortOrder
    videoId?: SortOrder
    filename?: SortOrderInput | SortOrder
    fileSize?: SortOrderInput | SortOrder
    mimeType?: SortOrderInput | SortOrder
    width?: SortOrderInput | SortOrder
    height?: SortOrderInput | SortOrder
    frameRate?: SortOrderInput | SortOrder
    bitrate?: SortOrderInput | SortOrder
    originalUrl?: SortOrderInput | SortOrder
    uploadStatus?: SortOrderInput | SortOrder
    error?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    video?: VideoOrderByWithRelationInput
  }

  export type VideoMetadataWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    videoId?: number
    AND?: VideoMetadataWhereInput | VideoMetadataWhereInput[]
    OR?: VideoMetadataWhereInput[]
    NOT?: VideoMetadataWhereInput | VideoMetadataWhereInput[]
    filename?: StringNullableFilter<"VideoMetadata"> | string | null
    fileSize?: IntNullableFilter<"VideoMetadata"> | number | null
    mimeType?: StringNullableFilter<"VideoMetadata"> | string | null
    width?: IntNullableFilter<"VideoMetadata"> | number | null
    height?: IntNullableFilter<"VideoMetadata"> | number | null
    frameRate?: FloatNullableFilter<"VideoMetadata"> | number | null
    bitrate?: IntNullableFilter<"VideoMetadata"> | number | null
    originalUrl?: StringNullableFilter<"VideoMetadata"> | string | null
    uploadStatus?: StringNullableFilter<"VideoMetadata"> | string | null
    error?: StringNullableFilter<"VideoMetadata"> | string | null
    metadata?: JsonNullableFilter<"VideoMetadata">
    createdAt?: DateTimeFilter<"VideoMetadata"> | Date | string
    updatedAt?: DateTimeFilter<"VideoMetadata"> | Date | string
    video?: XOR<VideoScalarRelationFilter, VideoWhereInput>
  }, "id" | "videoId">

  export type VideoMetadataOrderByWithAggregationInput = {
    id?: SortOrder
    videoId?: SortOrder
    filename?: SortOrderInput | SortOrder
    fileSize?: SortOrderInput | SortOrder
    mimeType?: SortOrderInput | SortOrder
    width?: SortOrderInput | SortOrder
    height?: SortOrderInput | SortOrder
    frameRate?: SortOrderInput | SortOrder
    bitrate?: SortOrderInput | SortOrder
    originalUrl?: SortOrderInput | SortOrder
    uploadStatus?: SortOrderInput | SortOrder
    error?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: VideoMetadataCountOrderByAggregateInput
    _avg?: VideoMetadataAvgOrderByAggregateInput
    _max?: VideoMetadataMaxOrderByAggregateInput
    _min?: VideoMetadataMinOrderByAggregateInput
    _sum?: VideoMetadataSumOrderByAggregateInput
  }

  export type VideoMetadataScalarWhereWithAggregatesInput = {
    AND?: VideoMetadataScalarWhereWithAggregatesInput | VideoMetadataScalarWhereWithAggregatesInput[]
    OR?: VideoMetadataScalarWhereWithAggregatesInput[]
    NOT?: VideoMetadataScalarWhereWithAggregatesInput | VideoMetadataScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"VideoMetadata"> | number
    videoId?: IntWithAggregatesFilter<"VideoMetadata"> | number
    filename?: StringNullableWithAggregatesFilter<"VideoMetadata"> | string | null
    fileSize?: IntNullableWithAggregatesFilter<"VideoMetadata"> | number | null
    mimeType?: StringNullableWithAggregatesFilter<"VideoMetadata"> | string | null
    width?: IntNullableWithAggregatesFilter<"VideoMetadata"> | number | null
    height?: IntNullableWithAggregatesFilter<"VideoMetadata"> | number | null
    frameRate?: FloatNullableWithAggregatesFilter<"VideoMetadata"> | number | null
    bitrate?: IntNullableWithAggregatesFilter<"VideoMetadata"> | number | null
    originalUrl?: StringNullableWithAggregatesFilter<"VideoMetadata"> | string | null
    uploadStatus?: StringNullableWithAggregatesFilter<"VideoMetadata"> | string | null
    error?: StringNullableWithAggregatesFilter<"VideoMetadata"> | string | null
    metadata?: JsonNullableWithAggregatesFilter<"VideoMetadata">
    createdAt?: DateTimeWithAggregatesFilter<"VideoMetadata"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"VideoMetadata"> | Date | string
  }

  export type CommentWhereInput = {
    AND?: CommentWhereInput | CommentWhereInput[]
    OR?: CommentWhereInput[]
    NOT?: CommentWhereInput | CommentWhereInput[]
    id?: IntFilter<"Comment"> | number
    content?: StringFilter<"Comment"> | string
    userId?: StringFilter<"Comment"> | string
    videoId?: IntFilter<"Comment"> | number
    createdAt?: DateTimeFilter<"Comment"> | Date | string
    updatedAt?: DateTimeFilter<"Comment"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    video?: XOR<VideoScalarRelationFilter, VideoWhereInput>
  }

  export type CommentOrderByWithRelationInput = {
    id?: SortOrder
    content?: SortOrder
    userId?: SortOrder
    videoId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    video?: VideoOrderByWithRelationInput
  }

  export type CommentWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: CommentWhereInput | CommentWhereInput[]
    OR?: CommentWhereInput[]
    NOT?: CommentWhereInput | CommentWhereInput[]
    content?: StringFilter<"Comment"> | string
    userId?: StringFilter<"Comment"> | string
    videoId?: IntFilter<"Comment"> | number
    createdAt?: DateTimeFilter<"Comment"> | Date | string
    updatedAt?: DateTimeFilter<"Comment"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    video?: XOR<VideoScalarRelationFilter, VideoWhereInput>
  }, "id">

  export type CommentOrderByWithAggregationInput = {
    id?: SortOrder
    content?: SortOrder
    userId?: SortOrder
    videoId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CommentCountOrderByAggregateInput
    _avg?: CommentAvgOrderByAggregateInput
    _max?: CommentMaxOrderByAggregateInput
    _min?: CommentMinOrderByAggregateInput
    _sum?: CommentSumOrderByAggregateInput
  }

  export type CommentScalarWhereWithAggregatesInput = {
    AND?: CommentScalarWhereWithAggregatesInput | CommentScalarWhereWithAggregatesInput[]
    OR?: CommentScalarWhereWithAggregatesInput[]
    NOT?: CommentScalarWhereWithAggregatesInput | CommentScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Comment"> | number
    content?: StringWithAggregatesFilter<"Comment"> | string
    userId?: StringWithAggregatesFilter<"Comment"> | string
    videoId?: IntWithAggregatesFilter<"Comment"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Comment"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Comment"> | Date | string
  }

  export type LikeWhereInput = {
    AND?: LikeWhereInput | LikeWhereInput[]
    OR?: LikeWhereInput[]
    NOT?: LikeWhereInput | LikeWhereInput[]
    id?: IntFilter<"Like"> | number
    userId?: StringFilter<"Like"> | string
    videoId?: IntFilter<"Like"> | number
    createdAt?: DateTimeFilter<"Like"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    video?: XOR<VideoScalarRelationFilter, VideoWhereInput>
  }

  export type LikeOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    videoId?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
    video?: VideoOrderByWithRelationInput
  }

  export type LikeWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    uq_like_user_video?: LikeUq_like_user_videoCompoundUniqueInput
    AND?: LikeWhereInput | LikeWhereInput[]
    OR?: LikeWhereInput[]
    NOT?: LikeWhereInput | LikeWhereInput[]
    userId?: StringFilter<"Like"> | string
    videoId?: IntFilter<"Like"> | number
    createdAt?: DateTimeFilter<"Like"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    video?: XOR<VideoScalarRelationFilter, VideoWhereInput>
  }, "id" | "uq_like_user_video">

  export type LikeOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    videoId?: SortOrder
    createdAt?: SortOrder
    _count?: LikeCountOrderByAggregateInput
    _avg?: LikeAvgOrderByAggregateInput
    _max?: LikeMaxOrderByAggregateInput
    _min?: LikeMinOrderByAggregateInput
    _sum?: LikeSumOrderByAggregateInput
  }

  export type LikeScalarWhereWithAggregatesInput = {
    AND?: LikeScalarWhereWithAggregatesInput | LikeScalarWhereWithAggregatesInput[]
    OR?: LikeScalarWhereWithAggregatesInput[]
    NOT?: LikeScalarWhereWithAggregatesInput | LikeScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Like"> | number
    userId?: StringWithAggregatesFilter<"Like"> | string
    videoId?: IntWithAggregatesFilter<"Like"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Like"> | Date | string
  }

  export type VideoViewWhereInput = {
    AND?: VideoViewWhereInput | VideoViewWhereInput[]
    OR?: VideoViewWhereInput[]
    NOT?: VideoViewWhereInput | VideoViewWhereInput[]
    id?: IntFilter<"VideoView"> | number
    userId?: StringNullableFilter<"VideoView"> | string | null
    videoId?: IntFilter<"VideoView"> | number
    ipAddress?: StringNullableFilter<"VideoView"> | string | null
    userAgent?: StringNullableFilter<"VideoView"> | string | null
    createdAt?: DateTimeFilter<"VideoView"> | Date | string
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    video?: XOR<VideoScalarRelationFilter, VideoWhereInput>
  }

  export type VideoViewOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    videoId?: SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
    video?: VideoOrderByWithRelationInput
  }

  export type VideoViewWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: VideoViewWhereInput | VideoViewWhereInput[]
    OR?: VideoViewWhereInput[]
    NOT?: VideoViewWhereInput | VideoViewWhereInput[]
    userId?: StringNullableFilter<"VideoView"> | string | null
    videoId?: IntFilter<"VideoView"> | number
    ipAddress?: StringNullableFilter<"VideoView"> | string | null
    userAgent?: StringNullableFilter<"VideoView"> | string | null
    createdAt?: DateTimeFilter<"VideoView"> | Date | string
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    video?: XOR<VideoScalarRelationFilter, VideoWhereInput>
  }, "id">

  export type VideoViewOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    videoId?: SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: VideoViewCountOrderByAggregateInput
    _avg?: VideoViewAvgOrderByAggregateInput
    _max?: VideoViewMaxOrderByAggregateInput
    _min?: VideoViewMinOrderByAggregateInput
    _sum?: VideoViewSumOrderByAggregateInput
  }

  export type VideoViewScalarWhereWithAggregatesInput = {
    AND?: VideoViewScalarWhereWithAggregatesInput | VideoViewScalarWhereWithAggregatesInput[]
    OR?: VideoViewScalarWhereWithAggregatesInput[]
    NOT?: VideoViewScalarWhereWithAggregatesInput | VideoViewScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"VideoView"> | number
    userId?: StringNullableWithAggregatesFilter<"VideoView"> | string | null
    videoId?: IntWithAggregatesFilter<"VideoView"> | number
    ipAddress?: StringNullableWithAggregatesFilter<"VideoView"> | string | null
    userAgent?: StringNullableWithAggregatesFilter<"VideoView"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"VideoView"> | Date | string
  }

  export type UserCreateInput = {
    id: string
    email: string
    emailVerified?: boolean
    name?: string | null
    username?: string | null
    bio?: string | null
    profileImageUrl?: string | null
    coverImageUrl?: string | null
    isCreator?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    videos?: VideoCreateNestedManyWithoutUserInput
    comments?: CommentCreateNestedManyWithoutUserInput
    likes?: LikeCreateNestedManyWithoutUserInput
    videoViews?: VideoViewCreateNestedManyWithoutUserInput
    followers?: FollowerCreateNestedManyWithoutFollowingInput
    following?: FollowerCreateNestedManyWithoutFollowerInput
  }

  export type UserUncheckedCreateInput = {
    id: string
    email: string
    emailVerified?: boolean
    name?: string | null
    username?: string | null
    bio?: string | null
    profileImageUrl?: string | null
    coverImageUrl?: string | null
    isCreator?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    videos?: VideoUncheckedCreateNestedManyWithoutUserInput
    comments?: CommentUncheckedCreateNestedManyWithoutUserInput
    likes?: LikeUncheckedCreateNestedManyWithoutUserInput
    videoViews?: VideoViewUncheckedCreateNestedManyWithoutUserInput
    followers?: FollowerUncheckedCreateNestedManyWithoutFollowingInput
    following?: FollowerUncheckedCreateNestedManyWithoutFollowerInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    name?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isCreator?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    videos?: VideoUpdateManyWithoutUserNestedInput
    comments?: CommentUpdateManyWithoutUserNestedInput
    likes?: LikeUpdateManyWithoutUserNestedInput
    videoViews?: VideoViewUpdateManyWithoutUserNestedInput
    followers?: FollowerUpdateManyWithoutFollowingNestedInput
    following?: FollowerUpdateManyWithoutFollowerNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    name?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isCreator?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    videos?: VideoUncheckedUpdateManyWithoutUserNestedInput
    comments?: CommentUncheckedUpdateManyWithoutUserNestedInput
    likes?: LikeUncheckedUpdateManyWithoutUserNestedInput
    videoViews?: VideoViewUncheckedUpdateManyWithoutUserNestedInput
    followers?: FollowerUncheckedUpdateManyWithoutFollowingNestedInput
    following?: FollowerUncheckedUpdateManyWithoutFollowerNestedInput
  }

  export type UserCreateManyInput = {
    id: string
    email: string
    emailVerified?: boolean
    name?: string | null
    username?: string | null
    bio?: string | null
    profileImageUrl?: string | null
    coverImageUrl?: string | null
    isCreator?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    name?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isCreator?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    name?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isCreator?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FollowerCreateInput = {
    id?: string
    createdAt?: Date | string
    follower: UserCreateNestedOneWithoutFollowingInput
    following: UserCreateNestedOneWithoutFollowersInput
  }

  export type FollowerUncheckedCreateInput = {
    id?: string
    followerId: string
    followingId: string
    createdAt?: Date | string
  }

  export type FollowerUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    follower?: UserUpdateOneRequiredWithoutFollowingNestedInput
    following?: UserUpdateOneRequiredWithoutFollowersNestedInput
  }

  export type FollowerUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    followerId?: StringFieldUpdateOperationsInput | string
    followingId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FollowerCreateManyInput = {
    id?: string
    followerId: string
    followingId: string
    createdAt?: Date | string
  }

  export type FollowerUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FollowerUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    followerId?: StringFieldUpdateOperationsInput | string
    followingId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VideoCreateInput = {
    title: string
    description?: string | null
    assetId?: string | null
    uploadId?: string | null
    playbackId?: string | null
    status?: string
    duration?: number | null
    aspectRatio?: string | null
    thumbnailUrl?: string | null
    videoUrl?: string | null
    isPublished?: boolean
    isPremium?: boolean
    price?: number | null
    viewCount?: number
    likeCount?: number
    commentCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutVideosInput
    metadata?: VideoMetadataCreateNestedOneWithoutVideoInput
    comments?: CommentCreateNestedManyWithoutVideoInput
    likes?: LikeCreateNestedManyWithoutVideoInput
    views?: VideoViewCreateNestedManyWithoutVideoInput
  }

  export type VideoUncheckedCreateInput = {
    id?: number
    user_id: string
    title: string
    description?: string | null
    assetId?: string | null
    uploadId?: string | null
    playbackId?: string | null
    status?: string
    duration?: number | null
    aspectRatio?: string | null
    thumbnailUrl?: string | null
    videoUrl?: string | null
    isPublished?: boolean
    isPremium?: boolean
    price?: number | null
    viewCount?: number
    likeCount?: number
    commentCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    metadata?: VideoMetadataUncheckedCreateNestedOneWithoutVideoInput
    comments?: CommentUncheckedCreateNestedManyWithoutVideoInput
    likes?: LikeUncheckedCreateNestedManyWithoutVideoInput
    views?: VideoViewUncheckedCreateNestedManyWithoutVideoInput
  }

  export type VideoUpdateInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    assetId?: NullableStringFieldUpdateOperationsInput | string | null
    uploadId?: NullableStringFieldUpdateOperationsInput | string | null
    playbackId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    duration?: NullableFloatFieldUpdateOperationsInput | number | null
    aspectRatio?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnailUrl?: NullableStringFieldUpdateOperationsInput | string | null
    videoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    isPremium?: BoolFieldUpdateOperationsInput | boolean
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    viewCount?: IntFieldUpdateOperationsInput | number
    likeCount?: IntFieldUpdateOperationsInput | number
    commentCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutVideosNestedInput
    metadata?: VideoMetadataUpdateOneWithoutVideoNestedInput
    comments?: CommentUpdateManyWithoutVideoNestedInput
    likes?: LikeUpdateManyWithoutVideoNestedInput
    views?: VideoViewUpdateManyWithoutVideoNestedInput
  }

  export type VideoUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    user_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    assetId?: NullableStringFieldUpdateOperationsInput | string | null
    uploadId?: NullableStringFieldUpdateOperationsInput | string | null
    playbackId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    duration?: NullableFloatFieldUpdateOperationsInput | number | null
    aspectRatio?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnailUrl?: NullableStringFieldUpdateOperationsInput | string | null
    videoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    isPremium?: BoolFieldUpdateOperationsInput | boolean
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    viewCount?: IntFieldUpdateOperationsInput | number
    likeCount?: IntFieldUpdateOperationsInput | number
    commentCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: VideoMetadataUncheckedUpdateOneWithoutVideoNestedInput
    comments?: CommentUncheckedUpdateManyWithoutVideoNestedInput
    likes?: LikeUncheckedUpdateManyWithoutVideoNestedInput
    views?: VideoViewUncheckedUpdateManyWithoutVideoNestedInput
  }

  export type VideoCreateManyInput = {
    id?: number
    user_id: string
    title: string
    description?: string | null
    assetId?: string | null
    uploadId?: string | null
    playbackId?: string | null
    status?: string
    duration?: number | null
    aspectRatio?: string | null
    thumbnailUrl?: string | null
    videoUrl?: string | null
    isPublished?: boolean
    isPremium?: boolean
    price?: number | null
    viewCount?: number
    likeCount?: number
    commentCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VideoUpdateManyMutationInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    assetId?: NullableStringFieldUpdateOperationsInput | string | null
    uploadId?: NullableStringFieldUpdateOperationsInput | string | null
    playbackId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    duration?: NullableFloatFieldUpdateOperationsInput | number | null
    aspectRatio?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnailUrl?: NullableStringFieldUpdateOperationsInput | string | null
    videoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    isPremium?: BoolFieldUpdateOperationsInput | boolean
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    viewCount?: IntFieldUpdateOperationsInput | number
    likeCount?: IntFieldUpdateOperationsInput | number
    commentCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VideoUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    user_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    assetId?: NullableStringFieldUpdateOperationsInput | string | null
    uploadId?: NullableStringFieldUpdateOperationsInput | string | null
    playbackId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    duration?: NullableFloatFieldUpdateOperationsInput | number | null
    aspectRatio?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnailUrl?: NullableStringFieldUpdateOperationsInput | string | null
    videoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    isPremium?: BoolFieldUpdateOperationsInput | boolean
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    viewCount?: IntFieldUpdateOperationsInput | number
    likeCount?: IntFieldUpdateOperationsInput | number
    commentCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VideoMetadataCreateInput = {
    filename?: string | null
    fileSize?: number | null
    mimeType?: string | null
    width?: number | null
    height?: number | null
    frameRate?: number | null
    bitrate?: number | null
    originalUrl?: string | null
    uploadStatus?: string | null
    error?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    video: VideoCreateNestedOneWithoutMetadataInput
  }

  export type VideoMetadataUncheckedCreateInput = {
    id?: number
    videoId: number
    filename?: string | null
    fileSize?: number | null
    mimeType?: string | null
    width?: number | null
    height?: number | null
    frameRate?: number | null
    bitrate?: number | null
    originalUrl?: string | null
    uploadStatus?: string | null
    error?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VideoMetadataUpdateInput = {
    filename?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    frameRate?: NullableFloatFieldUpdateOperationsInput | number | null
    bitrate?: NullableIntFieldUpdateOperationsInput | number | null
    originalUrl?: NullableStringFieldUpdateOperationsInput | string | null
    uploadStatus?: NullableStringFieldUpdateOperationsInput | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    video?: VideoUpdateOneRequiredWithoutMetadataNestedInput
  }

  export type VideoMetadataUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    videoId?: IntFieldUpdateOperationsInput | number
    filename?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    frameRate?: NullableFloatFieldUpdateOperationsInput | number | null
    bitrate?: NullableIntFieldUpdateOperationsInput | number | null
    originalUrl?: NullableStringFieldUpdateOperationsInput | string | null
    uploadStatus?: NullableStringFieldUpdateOperationsInput | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VideoMetadataCreateManyInput = {
    id?: number
    videoId: number
    filename?: string | null
    fileSize?: number | null
    mimeType?: string | null
    width?: number | null
    height?: number | null
    frameRate?: number | null
    bitrate?: number | null
    originalUrl?: string | null
    uploadStatus?: string | null
    error?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VideoMetadataUpdateManyMutationInput = {
    filename?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    frameRate?: NullableFloatFieldUpdateOperationsInput | number | null
    bitrate?: NullableIntFieldUpdateOperationsInput | number | null
    originalUrl?: NullableStringFieldUpdateOperationsInput | string | null
    uploadStatus?: NullableStringFieldUpdateOperationsInput | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VideoMetadataUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    videoId?: IntFieldUpdateOperationsInput | number
    filename?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    frameRate?: NullableFloatFieldUpdateOperationsInput | number | null
    bitrate?: NullableIntFieldUpdateOperationsInput | number | null
    originalUrl?: NullableStringFieldUpdateOperationsInput | string | null
    uploadStatus?: NullableStringFieldUpdateOperationsInput | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommentCreateInput = {
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutCommentsInput
    video: VideoCreateNestedOneWithoutCommentsInput
  }

  export type CommentUncheckedCreateInput = {
    id?: number
    content: string
    userId: string
    videoId: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CommentUpdateInput = {
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutCommentsNestedInput
    video?: VideoUpdateOneRequiredWithoutCommentsNestedInput
  }

  export type CommentUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    videoId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommentCreateManyInput = {
    id?: number
    content: string
    userId: string
    videoId: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CommentUpdateManyMutationInput = {
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommentUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    videoId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LikeCreateInput = {
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutLikesInput
    video: VideoCreateNestedOneWithoutLikesInput
  }

  export type LikeUncheckedCreateInput = {
    id?: number
    userId: string
    videoId: number
    createdAt?: Date | string
  }

  export type LikeUpdateInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutLikesNestedInput
    video?: VideoUpdateOneRequiredWithoutLikesNestedInput
  }

  export type LikeUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: StringFieldUpdateOperationsInput | string
    videoId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LikeCreateManyInput = {
    id?: number
    userId: string
    videoId: number
    createdAt?: Date | string
  }

  export type LikeUpdateManyMutationInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LikeUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: StringFieldUpdateOperationsInput | string
    videoId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VideoViewCreateInput = {
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
    user?: UserCreateNestedOneWithoutVideoViewsInput
    video: VideoCreateNestedOneWithoutViewsInput
  }

  export type VideoViewUncheckedCreateInput = {
    id?: number
    userId?: string | null
    videoId: number
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
  }

  export type VideoViewUpdateInput = {
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutVideoViewsNestedInput
    video?: VideoUpdateOneRequiredWithoutViewsNestedInput
  }

  export type VideoViewUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    videoId?: IntFieldUpdateOperationsInput | number
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VideoViewCreateManyInput = {
    id?: number
    userId?: string | null
    videoId: number
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
  }

  export type VideoViewUpdateManyMutationInput = {
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VideoViewUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    videoId?: IntFieldUpdateOperationsInput | number
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type VideoListRelationFilter = {
    every?: VideoWhereInput
    some?: VideoWhereInput
    none?: VideoWhereInput
  }

  export type CommentListRelationFilter = {
    every?: CommentWhereInput
    some?: CommentWhereInput
    none?: CommentWhereInput
  }

  export type LikeListRelationFilter = {
    every?: LikeWhereInput
    some?: LikeWhereInput
    none?: LikeWhereInput
  }

  export type VideoViewListRelationFilter = {
    every?: VideoViewWhereInput
    some?: VideoViewWhereInput
    none?: VideoViewWhereInput
  }

  export type FollowerListRelationFilter = {
    every?: FollowerWhereInput
    some?: FollowerWhereInput
    none?: FollowerWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type VideoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CommentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LikeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type VideoViewOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type FollowerOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    name?: SortOrder
    username?: SortOrder
    bio?: SortOrder
    profileImageUrl?: SortOrder
    coverImageUrl?: SortOrder
    isCreator?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    name?: SortOrder
    username?: SortOrder
    bio?: SortOrder
    profileImageUrl?: SortOrder
    coverImageUrl?: SortOrder
    isCreator?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    name?: SortOrder
    username?: SortOrder
    bio?: SortOrder
    profileImageUrl?: SortOrder
    coverImageUrl?: SortOrder
    isCreator?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type FollowerUq_follower_followingCompoundUniqueInput = {
    followerId: string
    followingId: string
  }

  export type FollowerCountOrderByAggregateInput = {
    id?: SortOrder
    followerId?: SortOrder
    followingId?: SortOrder
    createdAt?: SortOrder
  }

  export type FollowerMaxOrderByAggregateInput = {
    id?: SortOrder
    followerId?: SortOrder
    followingId?: SortOrder
    createdAt?: SortOrder
  }

  export type FollowerMinOrderByAggregateInput = {
    id?: SortOrder
    followerId?: SortOrder
    followingId?: SortOrder
    createdAt?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type VideoMetadataNullableScalarRelationFilter = {
    is?: VideoMetadataWhereInput | null
    isNot?: VideoMetadataWhereInput | null
  }

  export type VideoCountOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    assetId?: SortOrder
    uploadId?: SortOrder
    playbackId?: SortOrder
    status?: SortOrder
    duration?: SortOrder
    aspectRatio?: SortOrder
    thumbnailUrl?: SortOrder
    videoUrl?: SortOrder
    isPublished?: SortOrder
    isPremium?: SortOrder
    price?: SortOrder
    viewCount?: SortOrder
    likeCount?: SortOrder
    commentCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VideoAvgOrderByAggregateInput = {
    id?: SortOrder
    duration?: SortOrder
    price?: SortOrder
    viewCount?: SortOrder
    likeCount?: SortOrder
    commentCount?: SortOrder
  }

  export type VideoMaxOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    assetId?: SortOrder
    uploadId?: SortOrder
    playbackId?: SortOrder
    status?: SortOrder
    duration?: SortOrder
    aspectRatio?: SortOrder
    thumbnailUrl?: SortOrder
    videoUrl?: SortOrder
    isPublished?: SortOrder
    isPremium?: SortOrder
    price?: SortOrder
    viewCount?: SortOrder
    likeCount?: SortOrder
    commentCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VideoMinOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    assetId?: SortOrder
    uploadId?: SortOrder
    playbackId?: SortOrder
    status?: SortOrder
    duration?: SortOrder
    aspectRatio?: SortOrder
    thumbnailUrl?: SortOrder
    videoUrl?: SortOrder
    isPublished?: SortOrder
    isPremium?: SortOrder
    price?: SortOrder
    viewCount?: SortOrder
    likeCount?: SortOrder
    commentCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VideoSumOrderByAggregateInput = {
    id?: SortOrder
    duration?: SortOrder
    price?: SortOrder
    viewCount?: SortOrder
    likeCount?: SortOrder
    commentCount?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type VideoScalarRelationFilter = {
    is?: VideoWhereInput
    isNot?: VideoWhereInput
  }

  export type VideoMetadataCountOrderByAggregateInput = {
    id?: SortOrder
    videoId?: SortOrder
    filename?: SortOrder
    fileSize?: SortOrder
    mimeType?: SortOrder
    width?: SortOrder
    height?: SortOrder
    frameRate?: SortOrder
    bitrate?: SortOrder
    originalUrl?: SortOrder
    uploadStatus?: SortOrder
    error?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VideoMetadataAvgOrderByAggregateInput = {
    id?: SortOrder
    videoId?: SortOrder
    fileSize?: SortOrder
    width?: SortOrder
    height?: SortOrder
    frameRate?: SortOrder
    bitrate?: SortOrder
  }

  export type VideoMetadataMaxOrderByAggregateInput = {
    id?: SortOrder
    videoId?: SortOrder
    filename?: SortOrder
    fileSize?: SortOrder
    mimeType?: SortOrder
    width?: SortOrder
    height?: SortOrder
    frameRate?: SortOrder
    bitrate?: SortOrder
    originalUrl?: SortOrder
    uploadStatus?: SortOrder
    error?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VideoMetadataMinOrderByAggregateInput = {
    id?: SortOrder
    videoId?: SortOrder
    filename?: SortOrder
    fileSize?: SortOrder
    mimeType?: SortOrder
    width?: SortOrder
    height?: SortOrder
    frameRate?: SortOrder
    bitrate?: SortOrder
    originalUrl?: SortOrder
    uploadStatus?: SortOrder
    error?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VideoMetadataSumOrderByAggregateInput = {
    id?: SortOrder
    videoId?: SortOrder
    fileSize?: SortOrder
    width?: SortOrder
    height?: SortOrder
    frameRate?: SortOrder
    bitrate?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type CommentCountOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    userId?: SortOrder
    videoId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CommentAvgOrderByAggregateInput = {
    id?: SortOrder
    videoId?: SortOrder
  }

  export type CommentMaxOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    userId?: SortOrder
    videoId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CommentMinOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    userId?: SortOrder
    videoId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CommentSumOrderByAggregateInput = {
    id?: SortOrder
    videoId?: SortOrder
  }

  export type LikeUq_like_user_videoCompoundUniqueInput = {
    userId: string
    videoId: number
  }

  export type LikeCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    videoId?: SortOrder
    createdAt?: SortOrder
  }

  export type LikeAvgOrderByAggregateInput = {
    id?: SortOrder
    videoId?: SortOrder
  }

  export type LikeMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    videoId?: SortOrder
    createdAt?: SortOrder
  }

  export type LikeMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    videoId?: SortOrder
    createdAt?: SortOrder
  }

  export type LikeSumOrderByAggregateInput = {
    id?: SortOrder
    videoId?: SortOrder
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type VideoViewCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    videoId?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    createdAt?: SortOrder
  }

  export type VideoViewAvgOrderByAggregateInput = {
    id?: SortOrder
    videoId?: SortOrder
  }

  export type VideoViewMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    videoId?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    createdAt?: SortOrder
  }

  export type VideoViewMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    videoId?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    createdAt?: SortOrder
  }

  export type VideoViewSumOrderByAggregateInput = {
    id?: SortOrder
    videoId?: SortOrder
  }

  export type VideoCreateNestedManyWithoutUserInput = {
    create?: XOR<VideoCreateWithoutUserInput, VideoUncheckedCreateWithoutUserInput> | VideoCreateWithoutUserInput[] | VideoUncheckedCreateWithoutUserInput[]
    connectOrCreate?: VideoCreateOrConnectWithoutUserInput | VideoCreateOrConnectWithoutUserInput[]
    createMany?: VideoCreateManyUserInputEnvelope
    connect?: VideoWhereUniqueInput | VideoWhereUniqueInput[]
  }

  export type CommentCreateNestedManyWithoutUserInput = {
    create?: XOR<CommentCreateWithoutUserInput, CommentUncheckedCreateWithoutUserInput> | CommentCreateWithoutUserInput[] | CommentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutUserInput | CommentCreateOrConnectWithoutUserInput[]
    createMany?: CommentCreateManyUserInputEnvelope
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
  }

  export type LikeCreateNestedManyWithoutUserInput = {
    create?: XOR<LikeCreateWithoutUserInput, LikeUncheckedCreateWithoutUserInput> | LikeCreateWithoutUserInput[] | LikeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LikeCreateOrConnectWithoutUserInput | LikeCreateOrConnectWithoutUserInput[]
    createMany?: LikeCreateManyUserInputEnvelope
    connect?: LikeWhereUniqueInput | LikeWhereUniqueInput[]
  }

  export type VideoViewCreateNestedManyWithoutUserInput = {
    create?: XOR<VideoViewCreateWithoutUserInput, VideoViewUncheckedCreateWithoutUserInput> | VideoViewCreateWithoutUserInput[] | VideoViewUncheckedCreateWithoutUserInput[]
    connectOrCreate?: VideoViewCreateOrConnectWithoutUserInput | VideoViewCreateOrConnectWithoutUserInput[]
    createMany?: VideoViewCreateManyUserInputEnvelope
    connect?: VideoViewWhereUniqueInput | VideoViewWhereUniqueInput[]
  }

  export type FollowerCreateNestedManyWithoutFollowingInput = {
    create?: XOR<FollowerCreateWithoutFollowingInput, FollowerUncheckedCreateWithoutFollowingInput> | FollowerCreateWithoutFollowingInput[] | FollowerUncheckedCreateWithoutFollowingInput[]
    connectOrCreate?: FollowerCreateOrConnectWithoutFollowingInput | FollowerCreateOrConnectWithoutFollowingInput[]
    createMany?: FollowerCreateManyFollowingInputEnvelope
    connect?: FollowerWhereUniqueInput | FollowerWhereUniqueInput[]
  }

  export type FollowerCreateNestedManyWithoutFollowerInput = {
    create?: XOR<FollowerCreateWithoutFollowerInput, FollowerUncheckedCreateWithoutFollowerInput> | FollowerCreateWithoutFollowerInput[] | FollowerUncheckedCreateWithoutFollowerInput[]
    connectOrCreate?: FollowerCreateOrConnectWithoutFollowerInput | FollowerCreateOrConnectWithoutFollowerInput[]
    createMany?: FollowerCreateManyFollowerInputEnvelope
    connect?: FollowerWhereUniqueInput | FollowerWhereUniqueInput[]
  }

  export type VideoUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<VideoCreateWithoutUserInput, VideoUncheckedCreateWithoutUserInput> | VideoCreateWithoutUserInput[] | VideoUncheckedCreateWithoutUserInput[]
    connectOrCreate?: VideoCreateOrConnectWithoutUserInput | VideoCreateOrConnectWithoutUserInput[]
    createMany?: VideoCreateManyUserInputEnvelope
    connect?: VideoWhereUniqueInput | VideoWhereUniqueInput[]
  }

  export type CommentUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<CommentCreateWithoutUserInput, CommentUncheckedCreateWithoutUserInput> | CommentCreateWithoutUserInput[] | CommentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutUserInput | CommentCreateOrConnectWithoutUserInput[]
    createMany?: CommentCreateManyUserInputEnvelope
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
  }

  export type LikeUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<LikeCreateWithoutUserInput, LikeUncheckedCreateWithoutUserInput> | LikeCreateWithoutUserInput[] | LikeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LikeCreateOrConnectWithoutUserInput | LikeCreateOrConnectWithoutUserInput[]
    createMany?: LikeCreateManyUserInputEnvelope
    connect?: LikeWhereUniqueInput | LikeWhereUniqueInput[]
  }

  export type VideoViewUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<VideoViewCreateWithoutUserInput, VideoViewUncheckedCreateWithoutUserInput> | VideoViewCreateWithoutUserInput[] | VideoViewUncheckedCreateWithoutUserInput[]
    connectOrCreate?: VideoViewCreateOrConnectWithoutUserInput | VideoViewCreateOrConnectWithoutUserInput[]
    createMany?: VideoViewCreateManyUserInputEnvelope
    connect?: VideoViewWhereUniqueInput | VideoViewWhereUniqueInput[]
  }

  export type FollowerUncheckedCreateNestedManyWithoutFollowingInput = {
    create?: XOR<FollowerCreateWithoutFollowingInput, FollowerUncheckedCreateWithoutFollowingInput> | FollowerCreateWithoutFollowingInput[] | FollowerUncheckedCreateWithoutFollowingInput[]
    connectOrCreate?: FollowerCreateOrConnectWithoutFollowingInput | FollowerCreateOrConnectWithoutFollowingInput[]
    createMany?: FollowerCreateManyFollowingInputEnvelope
    connect?: FollowerWhereUniqueInput | FollowerWhereUniqueInput[]
  }

  export type FollowerUncheckedCreateNestedManyWithoutFollowerInput = {
    create?: XOR<FollowerCreateWithoutFollowerInput, FollowerUncheckedCreateWithoutFollowerInput> | FollowerCreateWithoutFollowerInput[] | FollowerUncheckedCreateWithoutFollowerInput[]
    connectOrCreate?: FollowerCreateOrConnectWithoutFollowerInput | FollowerCreateOrConnectWithoutFollowerInput[]
    createMany?: FollowerCreateManyFollowerInputEnvelope
    connect?: FollowerWhereUniqueInput | FollowerWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type VideoUpdateManyWithoutUserNestedInput = {
    create?: XOR<VideoCreateWithoutUserInput, VideoUncheckedCreateWithoutUserInput> | VideoCreateWithoutUserInput[] | VideoUncheckedCreateWithoutUserInput[]
    connectOrCreate?: VideoCreateOrConnectWithoutUserInput | VideoCreateOrConnectWithoutUserInput[]
    upsert?: VideoUpsertWithWhereUniqueWithoutUserInput | VideoUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: VideoCreateManyUserInputEnvelope
    set?: VideoWhereUniqueInput | VideoWhereUniqueInput[]
    disconnect?: VideoWhereUniqueInput | VideoWhereUniqueInput[]
    delete?: VideoWhereUniqueInput | VideoWhereUniqueInput[]
    connect?: VideoWhereUniqueInput | VideoWhereUniqueInput[]
    update?: VideoUpdateWithWhereUniqueWithoutUserInput | VideoUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: VideoUpdateManyWithWhereWithoutUserInput | VideoUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: VideoScalarWhereInput | VideoScalarWhereInput[]
  }

  export type CommentUpdateManyWithoutUserNestedInput = {
    create?: XOR<CommentCreateWithoutUserInput, CommentUncheckedCreateWithoutUserInput> | CommentCreateWithoutUserInput[] | CommentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutUserInput | CommentCreateOrConnectWithoutUserInput[]
    upsert?: CommentUpsertWithWhereUniqueWithoutUserInput | CommentUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CommentCreateManyUserInputEnvelope
    set?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    disconnect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    delete?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    update?: CommentUpdateWithWhereUniqueWithoutUserInput | CommentUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CommentUpdateManyWithWhereWithoutUserInput | CommentUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CommentScalarWhereInput | CommentScalarWhereInput[]
  }

  export type LikeUpdateManyWithoutUserNestedInput = {
    create?: XOR<LikeCreateWithoutUserInput, LikeUncheckedCreateWithoutUserInput> | LikeCreateWithoutUserInput[] | LikeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LikeCreateOrConnectWithoutUserInput | LikeCreateOrConnectWithoutUserInput[]
    upsert?: LikeUpsertWithWhereUniqueWithoutUserInput | LikeUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: LikeCreateManyUserInputEnvelope
    set?: LikeWhereUniqueInput | LikeWhereUniqueInput[]
    disconnect?: LikeWhereUniqueInput | LikeWhereUniqueInput[]
    delete?: LikeWhereUniqueInput | LikeWhereUniqueInput[]
    connect?: LikeWhereUniqueInput | LikeWhereUniqueInput[]
    update?: LikeUpdateWithWhereUniqueWithoutUserInput | LikeUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: LikeUpdateManyWithWhereWithoutUserInput | LikeUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: LikeScalarWhereInput | LikeScalarWhereInput[]
  }

  export type VideoViewUpdateManyWithoutUserNestedInput = {
    create?: XOR<VideoViewCreateWithoutUserInput, VideoViewUncheckedCreateWithoutUserInput> | VideoViewCreateWithoutUserInput[] | VideoViewUncheckedCreateWithoutUserInput[]
    connectOrCreate?: VideoViewCreateOrConnectWithoutUserInput | VideoViewCreateOrConnectWithoutUserInput[]
    upsert?: VideoViewUpsertWithWhereUniqueWithoutUserInput | VideoViewUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: VideoViewCreateManyUserInputEnvelope
    set?: VideoViewWhereUniqueInput | VideoViewWhereUniqueInput[]
    disconnect?: VideoViewWhereUniqueInput | VideoViewWhereUniqueInput[]
    delete?: VideoViewWhereUniqueInput | VideoViewWhereUniqueInput[]
    connect?: VideoViewWhereUniqueInput | VideoViewWhereUniqueInput[]
    update?: VideoViewUpdateWithWhereUniqueWithoutUserInput | VideoViewUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: VideoViewUpdateManyWithWhereWithoutUserInput | VideoViewUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: VideoViewScalarWhereInput | VideoViewScalarWhereInput[]
  }

  export type FollowerUpdateManyWithoutFollowingNestedInput = {
    create?: XOR<FollowerCreateWithoutFollowingInput, FollowerUncheckedCreateWithoutFollowingInput> | FollowerCreateWithoutFollowingInput[] | FollowerUncheckedCreateWithoutFollowingInput[]
    connectOrCreate?: FollowerCreateOrConnectWithoutFollowingInput | FollowerCreateOrConnectWithoutFollowingInput[]
    upsert?: FollowerUpsertWithWhereUniqueWithoutFollowingInput | FollowerUpsertWithWhereUniqueWithoutFollowingInput[]
    createMany?: FollowerCreateManyFollowingInputEnvelope
    set?: FollowerWhereUniqueInput | FollowerWhereUniqueInput[]
    disconnect?: FollowerWhereUniqueInput | FollowerWhereUniqueInput[]
    delete?: FollowerWhereUniqueInput | FollowerWhereUniqueInput[]
    connect?: FollowerWhereUniqueInput | FollowerWhereUniqueInput[]
    update?: FollowerUpdateWithWhereUniqueWithoutFollowingInput | FollowerUpdateWithWhereUniqueWithoutFollowingInput[]
    updateMany?: FollowerUpdateManyWithWhereWithoutFollowingInput | FollowerUpdateManyWithWhereWithoutFollowingInput[]
    deleteMany?: FollowerScalarWhereInput | FollowerScalarWhereInput[]
  }

  export type FollowerUpdateManyWithoutFollowerNestedInput = {
    create?: XOR<FollowerCreateWithoutFollowerInput, FollowerUncheckedCreateWithoutFollowerInput> | FollowerCreateWithoutFollowerInput[] | FollowerUncheckedCreateWithoutFollowerInput[]
    connectOrCreate?: FollowerCreateOrConnectWithoutFollowerInput | FollowerCreateOrConnectWithoutFollowerInput[]
    upsert?: FollowerUpsertWithWhereUniqueWithoutFollowerInput | FollowerUpsertWithWhereUniqueWithoutFollowerInput[]
    createMany?: FollowerCreateManyFollowerInputEnvelope
    set?: FollowerWhereUniqueInput | FollowerWhereUniqueInput[]
    disconnect?: FollowerWhereUniqueInput | FollowerWhereUniqueInput[]
    delete?: FollowerWhereUniqueInput | FollowerWhereUniqueInput[]
    connect?: FollowerWhereUniqueInput | FollowerWhereUniqueInput[]
    update?: FollowerUpdateWithWhereUniqueWithoutFollowerInput | FollowerUpdateWithWhereUniqueWithoutFollowerInput[]
    updateMany?: FollowerUpdateManyWithWhereWithoutFollowerInput | FollowerUpdateManyWithWhereWithoutFollowerInput[]
    deleteMany?: FollowerScalarWhereInput | FollowerScalarWhereInput[]
  }

  export type VideoUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<VideoCreateWithoutUserInput, VideoUncheckedCreateWithoutUserInput> | VideoCreateWithoutUserInput[] | VideoUncheckedCreateWithoutUserInput[]
    connectOrCreate?: VideoCreateOrConnectWithoutUserInput | VideoCreateOrConnectWithoutUserInput[]
    upsert?: VideoUpsertWithWhereUniqueWithoutUserInput | VideoUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: VideoCreateManyUserInputEnvelope
    set?: VideoWhereUniqueInput | VideoWhereUniqueInput[]
    disconnect?: VideoWhereUniqueInput | VideoWhereUniqueInput[]
    delete?: VideoWhereUniqueInput | VideoWhereUniqueInput[]
    connect?: VideoWhereUniqueInput | VideoWhereUniqueInput[]
    update?: VideoUpdateWithWhereUniqueWithoutUserInput | VideoUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: VideoUpdateManyWithWhereWithoutUserInput | VideoUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: VideoScalarWhereInput | VideoScalarWhereInput[]
  }

  export type CommentUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<CommentCreateWithoutUserInput, CommentUncheckedCreateWithoutUserInput> | CommentCreateWithoutUserInput[] | CommentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutUserInput | CommentCreateOrConnectWithoutUserInput[]
    upsert?: CommentUpsertWithWhereUniqueWithoutUserInput | CommentUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CommentCreateManyUserInputEnvelope
    set?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    disconnect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    delete?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    update?: CommentUpdateWithWhereUniqueWithoutUserInput | CommentUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CommentUpdateManyWithWhereWithoutUserInput | CommentUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CommentScalarWhereInput | CommentScalarWhereInput[]
  }

  export type LikeUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<LikeCreateWithoutUserInput, LikeUncheckedCreateWithoutUserInput> | LikeCreateWithoutUserInput[] | LikeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LikeCreateOrConnectWithoutUserInput | LikeCreateOrConnectWithoutUserInput[]
    upsert?: LikeUpsertWithWhereUniqueWithoutUserInput | LikeUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: LikeCreateManyUserInputEnvelope
    set?: LikeWhereUniqueInput | LikeWhereUniqueInput[]
    disconnect?: LikeWhereUniqueInput | LikeWhereUniqueInput[]
    delete?: LikeWhereUniqueInput | LikeWhereUniqueInput[]
    connect?: LikeWhereUniqueInput | LikeWhereUniqueInput[]
    update?: LikeUpdateWithWhereUniqueWithoutUserInput | LikeUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: LikeUpdateManyWithWhereWithoutUserInput | LikeUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: LikeScalarWhereInput | LikeScalarWhereInput[]
  }

  export type VideoViewUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<VideoViewCreateWithoutUserInput, VideoViewUncheckedCreateWithoutUserInput> | VideoViewCreateWithoutUserInput[] | VideoViewUncheckedCreateWithoutUserInput[]
    connectOrCreate?: VideoViewCreateOrConnectWithoutUserInput | VideoViewCreateOrConnectWithoutUserInput[]
    upsert?: VideoViewUpsertWithWhereUniqueWithoutUserInput | VideoViewUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: VideoViewCreateManyUserInputEnvelope
    set?: VideoViewWhereUniqueInput | VideoViewWhereUniqueInput[]
    disconnect?: VideoViewWhereUniqueInput | VideoViewWhereUniqueInput[]
    delete?: VideoViewWhereUniqueInput | VideoViewWhereUniqueInput[]
    connect?: VideoViewWhereUniqueInput | VideoViewWhereUniqueInput[]
    update?: VideoViewUpdateWithWhereUniqueWithoutUserInput | VideoViewUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: VideoViewUpdateManyWithWhereWithoutUserInput | VideoViewUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: VideoViewScalarWhereInput | VideoViewScalarWhereInput[]
  }

  export type FollowerUncheckedUpdateManyWithoutFollowingNestedInput = {
    create?: XOR<FollowerCreateWithoutFollowingInput, FollowerUncheckedCreateWithoutFollowingInput> | FollowerCreateWithoutFollowingInput[] | FollowerUncheckedCreateWithoutFollowingInput[]
    connectOrCreate?: FollowerCreateOrConnectWithoutFollowingInput | FollowerCreateOrConnectWithoutFollowingInput[]
    upsert?: FollowerUpsertWithWhereUniqueWithoutFollowingInput | FollowerUpsertWithWhereUniqueWithoutFollowingInput[]
    createMany?: FollowerCreateManyFollowingInputEnvelope
    set?: FollowerWhereUniqueInput | FollowerWhereUniqueInput[]
    disconnect?: FollowerWhereUniqueInput | FollowerWhereUniqueInput[]
    delete?: FollowerWhereUniqueInput | FollowerWhereUniqueInput[]
    connect?: FollowerWhereUniqueInput | FollowerWhereUniqueInput[]
    update?: FollowerUpdateWithWhereUniqueWithoutFollowingInput | FollowerUpdateWithWhereUniqueWithoutFollowingInput[]
    updateMany?: FollowerUpdateManyWithWhereWithoutFollowingInput | FollowerUpdateManyWithWhereWithoutFollowingInput[]
    deleteMany?: FollowerScalarWhereInput | FollowerScalarWhereInput[]
  }

  export type FollowerUncheckedUpdateManyWithoutFollowerNestedInput = {
    create?: XOR<FollowerCreateWithoutFollowerInput, FollowerUncheckedCreateWithoutFollowerInput> | FollowerCreateWithoutFollowerInput[] | FollowerUncheckedCreateWithoutFollowerInput[]
    connectOrCreate?: FollowerCreateOrConnectWithoutFollowerInput | FollowerCreateOrConnectWithoutFollowerInput[]
    upsert?: FollowerUpsertWithWhereUniqueWithoutFollowerInput | FollowerUpsertWithWhereUniqueWithoutFollowerInput[]
    createMany?: FollowerCreateManyFollowerInputEnvelope
    set?: FollowerWhereUniqueInput | FollowerWhereUniqueInput[]
    disconnect?: FollowerWhereUniqueInput | FollowerWhereUniqueInput[]
    delete?: FollowerWhereUniqueInput | FollowerWhereUniqueInput[]
    connect?: FollowerWhereUniqueInput | FollowerWhereUniqueInput[]
    update?: FollowerUpdateWithWhereUniqueWithoutFollowerInput | FollowerUpdateWithWhereUniqueWithoutFollowerInput[]
    updateMany?: FollowerUpdateManyWithWhereWithoutFollowerInput | FollowerUpdateManyWithWhereWithoutFollowerInput[]
    deleteMany?: FollowerScalarWhereInput | FollowerScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutFollowingInput = {
    create?: XOR<UserCreateWithoutFollowingInput, UserUncheckedCreateWithoutFollowingInput>
    connectOrCreate?: UserCreateOrConnectWithoutFollowingInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutFollowersInput = {
    create?: XOR<UserCreateWithoutFollowersInput, UserUncheckedCreateWithoutFollowersInput>
    connectOrCreate?: UserCreateOrConnectWithoutFollowersInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutFollowingNestedInput = {
    create?: XOR<UserCreateWithoutFollowingInput, UserUncheckedCreateWithoutFollowingInput>
    connectOrCreate?: UserCreateOrConnectWithoutFollowingInput
    upsert?: UserUpsertWithoutFollowingInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutFollowingInput, UserUpdateWithoutFollowingInput>, UserUncheckedUpdateWithoutFollowingInput>
  }

  export type UserUpdateOneRequiredWithoutFollowersNestedInput = {
    create?: XOR<UserCreateWithoutFollowersInput, UserUncheckedCreateWithoutFollowersInput>
    connectOrCreate?: UserCreateOrConnectWithoutFollowersInput
    upsert?: UserUpsertWithoutFollowersInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutFollowersInput, UserUpdateWithoutFollowersInput>, UserUncheckedUpdateWithoutFollowersInput>
  }

  export type UserCreateNestedOneWithoutVideosInput = {
    create?: XOR<UserCreateWithoutVideosInput, UserUncheckedCreateWithoutVideosInput>
    connectOrCreate?: UserCreateOrConnectWithoutVideosInput
    connect?: UserWhereUniqueInput
  }

  export type VideoMetadataCreateNestedOneWithoutVideoInput = {
    create?: XOR<VideoMetadataCreateWithoutVideoInput, VideoMetadataUncheckedCreateWithoutVideoInput>
    connectOrCreate?: VideoMetadataCreateOrConnectWithoutVideoInput
    connect?: VideoMetadataWhereUniqueInput
  }

  export type CommentCreateNestedManyWithoutVideoInput = {
    create?: XOR<CommentCreateWithoutVideoInput, CommentUncheckedCreateWithoutVideoInput> | CommentCreateWithoutVideoInput[] | CommentUncheckedCreateWithoutVideoInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutVideoInput | CommentCreateOrConnectWithoutVideoInput[]
    createMany?: CommentCreateManyVideoInputEnvelope
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
  }

  export type LikeCreateNestedManyWithoutVideoInput = {
    create?: XOR<LikeCreateWithoutVideoInput, LikeUncheckedCreateWithoutVideoInput> | LikeCreateWithoutVideoInput[] | LikeUncheckedCreateWithoutVideoInput[]
    connectOrCreate?: LikeCreateOrConnectWithoutVideoInput | LikeCreateOrConnectWithoutVideoInput[]
    createMany?: LikeCreateManyVideoInputEnvelope
    connect?: LikeWhereUniqueInput | LikeWhereUniqueInput[]
  }

  export type VideoViewCreateNestedManyWithoutVideoInput = {
    create?: XOR<VideoViewCreateWithoutVideoInput, VideoViewUncheckedCreateWithoutVideoInput> | VideoViewCreateWithoutVideoInput[] | VideoViewUncheckedCreateWithoutVideoInput[]
    connectOrCreate?: VideoViewCreateOrConnectWithoutVideoInput | VideoViewCreateOrConnectWithoutVideoInput[]
    createMany?: VideoViewCreateManyVideoInputEnvelope
    connect?: VideoViewWhereUniqueInput | VideoViewWhereUniqueInput[]
  }

  export type VideoMetadataUncheckedCreateNestedOneWithoutVideoInput = {
    create?: XOR<VideoMetadataCreateWithoutVideoInput, VideoMetadataUncheckedCreateWithoutVideoInput>
    connectOrCreate?: VideoMetadataCreateOrConnectWithoutVideoInput
    connect?: VideoMetadataWhereUniqueInput
  }

  export type CommentUncheckedCreateNestedManyWithoutVideoInput = {
    create?: XOR<CommentCreateWithoutVideoInput, CommentUncheckedCreateWithoutVideoInput> | CommentCreateWithoutVideoInput[] | CommentUncheckedCreateWithoutVideoInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutVideoInput | CommentCreateOrConnectWithoutVideoInput[]
    createMany?: CommentCreateManyVideoInputEnvelope
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
  }

  export type LikeUncheckedCreateNestedManyWithoutVideoInput = {
    create?: XOR<LikeCreateWithoutVideoInput, LikeUncheckedCreateWithoutVideoInput> | LikeCreateWithoutVideoInput[] | LikeUncheckedCreateWithoutVideoInput[]
    connectOrCreate?: LikeCreateOrConnectWithoutVideoInput | LikeCreateOrConnectWithoutVideoInput[]
    createMany?: LikeCreateManyVideoInputEnvelope
    connect?: LikeWhereUniqueInput | LikeWhereUniqueInput[]
  }

  export type VideoViewUncheckedCreateNestedManyWithoutVideoInput = {
    create?: XOR<VideoViewCreateWithoutVideoInput, VideoViewUncheckedCreateWithoutVideoInput> | VideoViewCreateWithoutVideoInput[] | VideoViewUncheckedCreateWithoutVideoInput[]
    connectOrCreate?: VideoViewCreateOrConnectWithoutVideoInput | VideoViewCreateOrConnectWithoutVideoInput[]
    createMany?: VideoViewCreateManyVideoInputEnvelope
    connect?: VideoViewWhereUniqueInput | VideoViewWhereUniqueInput[]
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutVideosNestedInput = {
    create?: XOR<UserCreateWithoutVideosInput, UserUncheckedCreateWithoutVideosInput>
    connectOrCreate?: UserCreateOrConnectWithoutVideosInput
    upsert?: UserUpsertWithoutVideosInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutVideosInput, UserUpdateWithoutVideosInput>, UserUncheckedUpdateWithoutVideosInput>
  }

  export type VideoMetadataUpdateOneWithoutVideoNestedInput = {
    create?: XOR<VideoMetadataCreateWithoutVideoInput, VideoMetadataUncheckedCreateWithoutVideoInput>
    connectOrCreate?: VideoMetadataCreateOrConnectWithoutVideoInput
    upsert?: VideoMetadataUpsertWithoutVideoInput
    disconnect?: VideoMetadataWhereInput | boolean
    delete?: VideoMetadataWhereInput | boolean
    connect?: VideoMetadataWhereUniqueInput
    update?: XOR<XOR<VideoMetadataUpdateToOneWithWhereWithoutVideoInput, VideoMetadataUpdateWithoutVideoInput>, VideoMetadataUncheckedUpdateWithoutVideoInput>
  }

  export type CommentUpdateManyWithoutVideoNestedInput = {
    create?: XOR<CommentCreateWithoutVideoInput, CommentUncheckedCreateWithoutVideoInput> | CommentCreateWithoutVideoInput[] | CommentUncheckedCreateWithoutVideoInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutVideoInput | CommentCreateOrConnectWithoutVideoInput[]
    upsert?: CommentUpsertWithWhereUniqueWithoutVideoInput | CommentUpsertWithWhereUniqueWithoutVideoInput[]
    createMany?: CommentCreateManyVideoInputEnvelope
    set?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    disconnect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    delete?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    update?: CommentUpdateWithWhereUniqueWithoutVideoInput | CommentUpdateWithWhereUniqueWithoutVideoInput[]
    updateMany?: CommentUpdateManyWithWhereWithoutVideoInput | CommentUpdateManyWithWhereWithoutVideoInput[]
    deleteMany?: CommentScalarWhereInput | CommentScalarWhereInput[]
  }

  export type LikeUpdateManyWithoutVideoNestedInput = {
    create?: XOR<LikeCreateWithoutVideoInput, LikeUncheckedCreateWithoutVideoInput> | LikeCreateWithoutVideoInput[] | LikeUncheckedCreateWithoutVideoInput[]
    connectOrCreate?: LikeCreateOrConnectWithoutVideoInput | LikeCreateOrConnectWithoutVideoInput[]
    upsert?: LikeUpsertWithWhereUniqueWithoutVideoInput | LikeUpsertWithWhereUniqueWithoutVideoInput[]
    createMany?: LikeCreateManyVideoInputEnvelope
    set?: LikeWhereUniqueInput | LikeWhereUniqueInput[]
    disconnect?: LikeWhereUniqueInput | LikeWhereUniqueInput[]
    delete?: LikeWhereUniqueInput | LikeWhereUniqueInput[]
    connect?: LikeWhereUniqueInput | LikeWhereUniqueInput[]
    update?: LikeUpdateWithWhereUniqueWithoutVideoInput | LikeUpdateWithWhereUniqueWithoutVideoInput[]
    updateMany?: LikeUpdateManyWithWhereWithoutVideoInput | LikeUpdateManyWithWhereWithoutVideoInput[]
    deleteMany?: LikeScalarWhereInput | LikeScalarWhereInput[]
  }

  export type VideoViewUpdateManyWithoutVideoNestedInput = {
    create?: XOR<VideoViewCreateWithoutVideoInput, VideoViewUncheckedCreateWithoutVideoInput> | VideoViewCreateWithoutVideoInput[] | VideoViewUncheckedCreateWithoutVideoInput[]
    connectOrCreate?: VideoViewCreateOrConnectWithoutVideoInput | VideoViewCreateOrConnectWithoutVideoInput[]
    upsert?: VideoViewUpsertWithWhereUniqueWithoutVideoInput | VideoViewUpsertWithWhereUniqueWithoutVideoInput[]
    createMany?: VideoViewCreateManyVideoInputEnvelope
    set?: VideoViewWhereUniqueInput | VideoViewWhereUniqueInput[]
    disconnect?: VideoViewWhereUniqueInput | VideoViewWhereUniqueInput[]
    delete?: VideoViewWhereUniqueInput | VideoViewWhereUniqueInput[]
    connect?: VideoViewWhereUniqueInput | VideoViewWhereUniqueInput[]
    update?: VideoViewUpdateWithWhereUniqueWithoutVideoInput | VideoViewUpdateWithWhereUniqueWithoutVideoInput[]
    updateMany?: VideoViewUpdateManyWithWhereWithoutVideoInput | VideoViewUpdateManyWithWhereWithoutVideoInput[]
    deleteMany?: VideoViewScalarWhereInput | VideoViewScalarWhereInput[]
  }

  export type VideoMetadataUncheckedUpdateOneWithoutVideoNestedInput = {
    create?: XOR<VideoMetadataCreateWithoutVideoInput, VideoMetadataUncheckedCreateWithoutVideoInput>
    connectOrCreate?: VideoMetadataCreateOrConnectWithoutVideoInput
    upsert?: VideoMetadataUpsertWithoutVideoInput
    disconnect?: VideoMetadataWhereInput | boolean
    delete?: VideoMetadataWhereInput | boolean
    connect?: VideoMetadataWhereUniqueInput
    update?: XOR<XOR<VideoMetadataUpdateToOneWithWhereWithoutVideoInput, VideoMetadataUpdateWithoutVideoInput>, VideoMetadataUncheckedUpdateWithoutVideoInput>
  }

  export type CommentUncheckedUpdateManyWithoutVideoNestedInput = {
    create?: XOR<CommentCreateWithoutVideoInput, CommentUncheckedCreateWithoutVideoInput> | CommentCreateWithoutVideoInput[] | CommentUncheckedCreateWithoutVideoInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutVideoInput | CommentCreateOrConnectWithoutVideoInput[]
    upsert?: CommentUpsertWithWhereUniqueWithoutVideoInput | CommentUpsertWithWhereUniqueWithoutVideoInput[]
    createMany?: CommentCreateManyVideoInputEnvelope
    set?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    disconnect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    delete?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    update?: CommentUpdateWithWhereUniqueWithoutVideoInput | CommentUpdateWithWhereUniqueWithoutVideoInput[]
    updateMany?: CommentUpdateManyWithWhereWithoutVideoInput | CommentUpdateManyWithWhereWithoutVideoInput[]
    deleteMany?: CommentScalarWhereInput | CommentScalarWhereInput[]
  }

  export type LikeUncheckedUpdateManyWithoutVideoNestedInput = {
    create?: XOR<LikeCreateWithoutVideoInput, LikeUncheckedCreateWithoutVideoInput> | LikeCreateWithoutVideoInput[] | LikeUncheckedCreateWithoutVideoInput[]
    connectOrCreate?: LikeCreateOrConnectWithoutVideoInput | LikeCreateOrConnectWithoutVideoInput[]
    upsert?: LikeUpsertWithWhereUniqueWithoutVideoInput | LikeUpsertWithWhereUniqueWithoutVideoInput[]
    createMany?: LikeCreateManyVideoInputEnvelope
    set?: LikeWhereUniqueInput | LikeWhereUniqueInput[]
    disconnect?: LikeWhereUniqueInput | LikeWhereUniqueInput[]
    delete?: LikeWhereUniqueInput | LikeWhereUniqueInput[]
    connect?: LikeWhereUniqueInput | LikeWhereUniqueInput[]
    update?: LikeUpdateWithWhereUniqueWithoutVideoInput | LikeUpdateWithWhereUniqueWithoutVideoInput[]
    updateMany?: LikeUpdateManyWithWhereWithoutVideoInput | LikeUpdateManyWithWhereWithoutVideoInput[]
    deleteMany?: LikeScalarWhereInput | LikeScalarWhereInput[]
  }

  export type VideoViewUncheckedUpdateManyWithoutVideoNestedInput = {
    create?: XOR<VideoViewCreateWithoutVideoInput, VideoViewUncheckedCreateWithoutVideoInput> | VideoViewCreateWithoutVideoInput[] | VideoViewUncheckedCreateWithoutVideoInput[]
    connectOrCreate?: VideoViewCreateOrConnectWithoutVideoInput | VideoViewCreateOrConnectWithoutVideoInput[]
    upsert?: VideoViewUpsertWithWhereUniqueWithoutVideoInput | VideoViewUpsertWithWhereUniqueWithoutVideoInput[]
    createMany?: VideoViewCreateManyVideoInputEnvelope
    set?: VideoViewWhereUniqueInput | VideoViewWhereUniqueInput[]
    disconnect?: VideoViewWhereUniqueInput | VideoViewWhereUniqueInput[]
    delete?: VideoViewWhereUniqueInput | VideoViewWhereUniqueInput[]
    connect?: VideoViewWhereUniqueInput | VideoViewWhereUniqueInput[]
    update?: VideoViewUpdateWithWhereUniqueWithoutVideoInput | VideoViewUpdateWithWhereUniqueWithoutVideoInput[]
    updateMany?: VideoViewUpdateManyWithWhereWithoutVideoInput | VideoViewUpdateManyWithWhereWithoutVideoInput[]
    deleteMany?: VideoViewScalarWhereInput | VideoViewScalarWhereInput[]
  }

  export type VideoCreateNestedOneWithoutMetadataInput = {
    create?: XOR<VideoCreateWithoutMetadataInput, VideoUncheckedCreateWithoutMetadataInput>
    connectOrCreate?: VideoCreateOrConnectWithoutMetadataInput
    connect?: VideoWhereUniqueInput
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type VideoUpdateOneRequiredWithoutMetadataNestedInput = {
    create?: XOR<VideoCreateWithoutMetadataInput, VideoUncheckedCreateWithoutMetadataInput>
    connectOrCreate?: VideoCreateOrConnectWithoutMetadataInput
    upsert?: VideoUpsertWithoutMetadataInput
    connect?: VideoWhereUniqueInput
    update?: XOR<XOR<VideoUpdateToOneWithWhereWithoutMetadataInput, VideoUpdateWithoutMetadataInput>, VideoUncheckedUpdateWithoutMetadataInput>
  }

  export type UserCreateNestedOneWithoutCommentsInput = {
    create?: XOR<UserCreateWithoutCommentsInput, UserUncheckedCreateWithoutCommentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCommentsInput
    connect?: UserWhereUniqueInput
  }

  export type VideoCreateNestedOneWithoutCommentsInput = {
    create?: XOR<VideoCreateWithoutCommentsInput, VideoUncheckedCreateWithoutCommentsInput>
    connectOrCreate?: VideoCreateOrConnectWithoutCommentsInput
    connect?: VideoWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutCommentsNestedInput = {
    create?: XOR<UserCreateWithoutCommentsInput, UserUncheckedCreateWithoutCommentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCommentsInput
    upsert?: UserUpsertWithoutCommentsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCommentsInput, UserUpdateWithoutCommentsInput>, UserUncheckedUpdateWithoutCommentsInput>
  }

  export type VideoUpdateOneRequiredWithoutCommentsNestedInput = {
    create?: XOR<VideoCreateWithoutCommentsInput, VideoUncheckedCreateWithoutCommentsInput>
    connectOrCreate?: VideoCreateOrConnectWithoutCommentsInput
    upsert?: VideoUpsertWithoutCommentsInput
    connect?: VideoWhereUniqueInput
    update?: XOR<XOR<VideoUpdateToOneWithWhereWithoutCommentsInput, VideoUpdateWithoutCommentsInput>, VideoUncheckedUpdateWithoutCommentsInput>
  }

  export type UserCreateNestedOneWithoutLikesInput = {
    create?: XOR<UserCreateWithoutLikesInput, UserUncheckedCreateWithoutLikesInput>
    connectOrCreate?: UserCreateOrConnectWithoutLikesInput
    connect?: UserWhereUniqueInput
  }

  export type VideoCreateNestedOneWithoutLikesInput = {
    create?: XOR<VideoCreateWithoutLikesInput, VideoUncheckedCreateWithoutLikesInput>
    connectOrCreate?: VideoCreateOrConnectWithoutLikesInput
    connect?: VideoWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutLikesNestedInput = {
    create?: XOR<UserCreateWithoutLikesInput, UserUncheckedCreateWithoutLikesInput>
    connectOrCreate?: UserCreateOrConnectWithoutLikesInput
    upsert?: UserUpsertWithoutLikesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutLikesInput, UserUpdateWithoutLikesInput>, UserUncheckedUpdateWithoutLikesInput>
  }

  export type VideoUpdateOneRequiredWithoutLikesNestedInput = {
    create?: XOR<VideoCreateWithoutLikesInput, VideoUncheckedCreateWithoutLikesInput>
    connectOrCreate?: VideoCreateOrConnectWithoutLikesInput
    upsert?: VideoUpsertWithoutLikesInput
    connect?: VideoWhereUniqueInput
    update?: XOR<XOR<VideoUpdateToOneWithWhereWithoutLikesInput, VideoUpdateWithoutLikesInput>, VideoUncheckedUpdateWithoutLikesInput>
  }

  export type UserCreateNestedOneWithoutVideoViewsInput = {
    create?: XOR<UserCreateWithoutVideoViewsInput, UserUncheckedCreateWithoutVideoViewsInput>
    connectOrCreate?: UserCreateOrConnectWithoutVideoViewsInput
    connect?: UserWhereUniqueInput
  }

  export type VideoCreateNestedOneWithoutViewsInput = {
    create?: XOR<VideoCreateWithoutViewsInput, VideoUncheckedCreateWithoutViewsInput>
    connectOrCreate?: VideoCreateOrConnectWithoutViewsInput
    connect?: VideoWhereUniqueInput
  }

  export type UserUpdateOneWithoutVideoViewsNestedInput = {
    create?: XOR<UserCreateWithoutVideoViewsInput, UserUncheckedCreateWithoutVideoViewsInput>
    connectOrCreate?: UserCreateOrConnectWithoutVideoViewsInput
    upsert?: UserUpsertWithoutVideoViewsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutVideoViewsInput, UserUpdateWithoutVideoViewsInput>, UserUncheckedUpdateWithoutVideoViewsInput>
  }

  export type VideoUpdateOneRequiredWithoutViewsNestedInput = {
    create?: XOR<VideoCreateWithoutViewsInput, VideoUncheckedCreateWithoutViewsInput>
    connectOrCreate?: VideoCreateOrConnectWithoutViewsInput
    upsert?: VideoUpsertWithoutViewsInput
    connect?: VideoWhereUniqueInput
    update?: XOR<XOR<VideoUpdateToOneWithWhereWithoutViewsInput, VideoUpdateWithoutViewsInput>, VideoUncheckedUpdateWithoutViewsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type VideoCreateWithoutUserInput = {
    title: string
    description?: string | null
    assetId?: string | null
    uploadId?: string | null
    playbackId?: string | null
    status?: string
    duration?: number | null
    aspectRatio?: string | null
    thumbnailUrl?: string | null
    videoUrl?: string | null
    isPublished?: boolean
    isPremium?: boolean
    price?: number | null
    viewCount?: number
    likeCount?: number
    commentCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    metadata?: VideoMetadataCreateNestedOneWithoutVideoInput
    comments?: CommentCreateNestedManyWithoutVideoInput
    likes?: LikeCreateNestedManyWithoutVideoInput
    views?: VideoViewCreateNestedManyWithoutVideoInput
  }

  export type VideoUncheckedCreateWithoutUserInput = {
    id?: number
    title: string
    description?: string | null
    assetId?: string | null
    uploadId?: string | null
    playbackId?: string | null
    status?: string
    duration?: number | null
    aspectRatio?: string | null
    thumbnailUrl?: string | null
    videoUrl?: string | null
    isPublished?: boolean
    isPremium?: boolean
    price?: number | null
    viewCount?: number
    likeCount?: number
    commentCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    metadata?: VideoMetadataUncheckedCreateNestedOneWithoutVideoInput
    comments?: CommentUncheckedCreateNestedManyWithoutVideoInput
    likes?: LikeUncheckedCreateNestedManyWithoutVideoInput
    views?: VideoViewUncheckedCreateNestedManyWithoutVideoInput
  }

  export type VideoCreateOrConnectWithoutUserInput = {
    where: VideoWhereUniqueInput
    create: XOR<VideoCreateWithoutUserInput, VideoUncheckedCreateWithoutUserInput>
  }

  export type VideoCreateManyUserInputEnvelope = {
    data: VideoCreateManyUserInput | VideoCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type CommentCreateWithoutUserInput = {
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    video: VideoCreateNestedOneWithoutCommentsInput
  }

  export type CommentUncheckedCreateWithoutUserInput = {
    id?: number
    content: string
    videoId: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CommentCreateOrConnectWithoutUserInput = {
    where: CommentWhereUniqueInput
    create: XOR<CommentCreateWithoutUserInput, CommentUncheckedCreateWithoutUserInput>
  }

  export type CommentCreateManyUserInputEnvelope = {
    data: CommentCreateManyUserInput | CommentCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type LikeCreateWithoutUserInput = {
    createdAt?: Date | string
    video: VideoCreateNestedOneWithoutLikesInput
  }

  export type LikeUncheckedCreateWithoutUserInput = {
    id?: number
    videoId: number
    createdAt?: Date | string
  }

  export type LikeCreateOrConnectWithoutUserInput = {
    where: LikeWhereUniqueInput
    create: XOR<LikeCreateWithoutUserInput, LikeUncheckedCreateWithoutUserInput>
  }

  export type LikeCreateManyUserInputEnvelope = {
    data: LikeCreateManyUserInput | LikeCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type VideoViewCreateWithoutUserInput = {
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
    video: VideoCreateNestedOneWithoutViewsInput
  }

  export type VideoViewUncheckedCreateWithoutUserInput = {
    id?: number
    videoId: number
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
  }

  export type VideoViewCreateOrConnectWithoutUserInput = {
    where: VideoViewWhereUniqueInput
    create: XOR<VideoViewCreateWithoutUserInput, VideoViewUncheckedCreateWithoutUserInput>
  }

  export type VideoViewCreateManyUserInputEnvelope = {
    data: VideoViewCreateManyUserInput | VideoViewCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type FollowerCreateWithoutFollowingInput = {
    id?: string
    createdAt?: Date | string
    follower: UserCreateNestedOneWithoutFollowingInput
  }

  export type FollowerUncheckedCreateWithoutFollowingInput = {
    id?: string
    followerId: string
    createdAt?: Date | string
  }

  export type FollowerCreateOrConnectWithoutFollowingInput = {
    where: FollowerWhereUniqueInput
    create: XOR<FollowerCreateWithoutFollowingInput, FollowerUncheckedCreateWithoutFollowingInput>
  }

  export type FollowerCreateManyFollowingInputEnvelope = {
    data: FollowerCreateManyFollowingInput | FollowerCreateManyFollowingInput[]
    skipDuplicates?: boolean
  }

  export type FollowerCreateWithoutFollowerInput = {
    id?: string
    createdAt?: Date | string
    following: UserCreateNestedOneWithoutFollowersInput
  }

  export type FollowerUncheckedCreateWithoutFollowerInput = {
    id?: string
    followingId: string
    createdAt?: Date | string
  }

  export type FollowerCreateOrConnectWithoutFollowerInput = {
    where: FollowerWhereUniqueInput
    create: XOR<FollowerCreateWithoutFollowerInput, FollowerUncheckedCreateWithoutFollowerInput>
  }

  export type FollowerCreateManyFollowerInputEnvelope = {
    data: FollowerCreateManyFollowerInput | FollowerCreateManyFollowerInput[]
    skipDuplicates?: boolean
  }

  export type VideoUpsertWithWhereUniqueWithoutUserInput = {
    where: VideoWhereUniqueInput
    update: XOR<VideoUpdateWithoutUserInput, VideoUncheckedUpdateWithoutUserInput>
    create: XOR<VideoCreateWithoutUserInput, VideoUncheckedCreateWithoutUserInput>
  }

  export type VideoUpdateWithWhereUniqueWithoutUserInput = {
    where: VideoWhereUniqueInput
    data: XOR<VideoUpdateWithoutUserInput, VideoUncheckedUpdateWithoutUserInput>
  }

  export type VideoUpdateManyWithWhereWithoutUserInput = {
    where: VideoScalarWhereInput
    data: XOR<VideoUpdateManyMutationInput, VideoUncheckedUpdateManyWithoutUserInput>
  }

  export type VideoScalarWhereInput = {
    AND?: VideoScalarWhereInput | VideoScalarWhereInput[]
    OR?: VideoScalarWhereInput[]
    NOT?: VideoScalarWhereInput | VideoScalarWhereInput[]
    id?: IntFilter<"Video"> | number
    user_id?: StringFilter<"Video"> | string
    title?: StringFilter<"Video"> | string
    description?: StringNullableFilter<"Video"> | string | null
    assetId?: StringNullableFilter<"Video"> | string | null
    uploadId?: StringNullableFilter<"Video"> | string | null
    playbackId?: StringNullableFilter<"Video"> | string | null
    status?: StringFilter<"Video"> | string
    duration?: FloatNullableFilter<"Video"> | number | null
    aspectRatio?: StringNullableFilter<"Video"> | string | null
    thumbnailUrl?: StringNullableFilter<"Video"> | string | null
    videoUrl?: StringNullableFilter<"Video"> | string | null
    isPublished?: BoolFilter<"Video"> | boolean
    isPremium?: BoolFilter<"Video"> | boolean
    price?: FloatNullableFilter<"Video"> | number | null
    viewCount?: IntFilter<"Video"> | number
    likeCount?: IntFilter<"Video"> | number
    commentCount?: IntFilter<"Video"> | number
    createdAt?: DateTimeFilter<"Video"> | Date | string
    updatedAt?: DateTimeFilter<"Video"> | Date | string
  }

  export type CommentUpsertWithWhereUniqueWithoutUserInput = {
    where: CommentWhereUniqueInput
    update: XOR<CommentUpdateWithoutUserInput, CommentUncheckedUpdateWithoutUserInput>
    create: XOR<CommentCreateWithoutUserInput, CommentUncheckedCreateWithoutUserInput>
  }

  export type CommentUpdateWithWhereUniqueWithoutUserInput = {
    where: CommentWhereUniqueInput
    data: XOR<CommentUpdateWithoutUserInput, CommentUncheckedUpdateWithoutUserInput>
  }

  export type CommentUpdateManyWithWhereWithoutUserInput = {
    where: CommentScalarWhereInput
    data: XOR<CommentUpdateManyMutationInput, CommentUncheckedUpdateManyWithoutUserInput>
  }

  export type CommentScalarWhereInput = {
    AND?: CommentScalarWhereInput | CommentScalarWhereInput[]
    OR?: CommentScalarWhereInput[]
    NOT?: CommentScalarWhereInput | CommentScalarWhereInput[]
    id?: IntFilter<"Comment"> | number
    content?: StringFilter<"Comment"> | string
    userId?: StringFilter<"Comment"> | string
    videoId?: IntFilter<"Comment"> | number
    createdAt?: DateTimeFilter<"Comment"> | Date | string
    updatedAt?: DateTimeFilter<"Comment"> | Date | string
  }

  export type LikeUpsertWithWhereUniqueWithoutUserInput = {
    where: LikeWhereUniqueInput
    update: XOR<LikeUpdateWithoutUserInput, LikeUncheckedUpdateWithoutUserInput>
    create: XOR<LikeCreateWithoutUserInput, LikeUncheckedCreateWithoutUserInput>
  }

  export type LikeUpdateWithWhereUniqueWithoutUserInput = {
    where: LikeWhereUniqueInput
    data: XOR<LikeUpdateWithoutUserInput, LikeUncheckedUpdateWithoutUserInput>
  }

  export type LikeUpdateManyWithWhereWithoutUserInput = {
    where: LikeScalarWhereInput
    data: XOR<LikeUpdateManyMutationInput, LikeUncheckedUpdateManyWithoutUserInput>
  }

  export type LikeScalarWhereInput = {
    AND?: LikeScalarWhereInput | LikeScalarWhereInput[]
    OR?: LikeScalarWhereInput[]
    NOT?: LikeScalarWhereInput | LikeScalarWhereInput[]
    id?: IntFilter<"Like"> | number
    userId?: StringFilter<"Like"> | string
    videoId?: IntFilter<"Like"> | number
    createdAt?: DateTimeFilter<"Like"> | Date | string
  }

  export type VideoViewUpsertWithWhereUniqueWithoutUserInput = {
    where: VideoViewWhereUniqueInput
    update: XOR<VideoViewUpdateWithoutUserInput, VideoViewUncheckedUpdateWithoutUserInput>
    create: XOR<VideoViewCreateWithoutUserInput, VideoViewUncheckedCreateWithoutUserInput>
  }

  export type VideoViewUpdateWithWhereUniqueWithoutUserInput = {
    where: VideoViewWhereUniqueInput
    data: XOR<VideoViewUpdateWithoutUserInput, VideoViewUncheckedUpdateWithoutUserInput>
  }

  export type VideoViewUpdateManyWithWhereWithoutUserInput = {
    where: VideoViewScalarWhereInput
    data: XOR<VideoViewUpdateManyMutationInput, VideoViewUncheckedUpdateManyWithoutUserInput>
  }

  export type VideoViewScalarWhereInput = {
    AND?: VideoViewScalarWhereInput | VideoViewScalarWhereInput[]
    OR?: VideoViewScalarWhereInput[]
    NOT?: VideoViewScalarWhereInput | VideoViewScalarWhereInput[]
    id?: IntFilter<"VideoView"> | number
    userId?: StringNullableFilter<"VideoView"> | string | null
    videoId?: IntFilter<"VideoView"> | number
    ipAddress?: StringNullableFilter<"VideoView"> | string | null
    userAgent?: StringNullableFilter<"VideoView"> | string | null
    createdAt?: DateTimeFilter<"VideoView"> | Date | string
  }

  export type FollowerUpsertWithWhereUniqueWithoutFollowingInput = {
    where: FollowerWhereUniqueInput
    update: XOR<FollowerUpdateWithoutFollowingInput, FollowerUncheckedUpdateWithoutFollowingInput>
    create: XOR<FollowerCreateWithoutFollowingInput, FollowerUncheckedCreateWithoutFollowingInput>
  }

  export type FollowerUpdateWithWhereUniqueWithoutFollowingInput = {
    where: FollowerWhereUniqueInput
    data: XOR<FollowerUpdateWithoutFollowingInput, FollowerUncheckedUpdateWithoutFollowingInput>
  }

  export type FollowerUpdateManyWithWhereWithoutFollowingInput = {
    where: FollowerScalarWhereInput
    data: XOR<FollowerUpdateManyMutationInput, FollowerUncheckedUpdateManyWithoutFollowingInput>
  }

  export type FollowerScalarWhereInput = {
    AND?: FollowerScalarWhereInput | FollowerScalarWhereInput[]
    OR?: FollowerScalarWhereInput[]
    NOT?: FollowerScalarWhereInput | FollowerScalarWhereInput[]
    id?: StringFilter<"Follower"> | string
    followerId?: StringFilter<"Follower"> | string
    followingId?: StringFilter<"Follower"> | string
    createdAt?: DateTimeFilter<"Follower"> | Date | string
  }

  export type FollowerUpsertWithWhereUniqueWithoutFollowerInput = {
    where: FollowerWhereUniqueInput
    update: XOR<FollowerUpdateWithoutFollowerInput, FollowerUncheckedUpdateWithoutFollowerInput>
    create: XOR<FollowerCreateWithoutFollowerInput, FollowerUncheckedCreateWithoutFollowerInput>
  }

  export type FollowerUpdateWithWhereUniqueWithoutFollowerInput = {
    where: FollowerWhereUniqueInput
    data: XOR<FollowerUpdateWithoutFollowerInput, FollowerUncheckedUpdateWithoutFollowerInput>
  }

  export type FollowerUpdateManyWithWhereWithoutFollowerInput = {
    where: FollowerScalarWhereInput
    data: XOR<FollowerUpdateManyMutationInput, FollowerUncheckedUpdateManyWithoutFollowerInput>
  }

  export type UserCreateWithoutFollowingInput = {
    id: string
    email: string
    emailVerified?: boolean
    name?: string | null
    username?: string | null
    bio?: string | null
    profileImageUrl?: string | null
    coverImageUrl?: string | null
    isCreator?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    videos?: VideoCreateNestedManyWithoutUserInput
    comments?: CommentCreateNestedManyWithoutUserInput
    likes?: LikeCreateNestedManyWithoutUserInput
    videoViews?: VideoViewCreateNestedManyWithoutUserInput
    followers?: FollowerCreateNestedManyWithoutFollowingInput
  }

  export type UserUncheckedCreateWithoutFollowingInput = {
    id: string
    email: string
    emailVerified?: boolean
    name?: string | null
    username?: string | null
    bio?: string | null
    profileImageUrl?: string | null
    coverImageUrl?: string | null
    isCreator?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    videos?: VideoUncheckedCreateNestedManyWithoutUserInput
    comments?: CommentUncheckedCreateNestedManyWithoutUserInput
    likes?: LikeUncheckedCreateNestedManyWithoutUserInput
    videoViews?: VideoViewUncheckedCreateNestedManyWithoutUserInput
    followers?: FollowerUncheckedCreateNestedManyWithoutFollowingInput
  }

  export type UserCreateOrConnectWithoutFollowingInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutFollowingInput, UserUncheckedCreateWithoutFollowingInput>
  }

  export type UserCreateWithoutFollowersInput = {
    id: string
    email: string
    emailVerified?: boolean
    name?: string | null
    username?: string | null
    bio?: string | null
    profileImageUrl?: string | null
    coverImageUrl?: string | null
    isCreator?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    videos?: VideoCreateNestedManyWithoutUserInput
    comments?: CommentCreateNestedManyWithoutUserInput
    likes?: LikeCreateNestedManyWithoutUserInput
    videoViews?: VideoViewCreateNestedManyWithoutUserInput
    following?: FollowerCreateNestedManyWithoutFollowerInput
  }

  export type UserUncheckedCreateWithoutFollowersInput = {
    id: string
    email: string
    emailVerified?: boolean
    name?: string | null
    username?: string | null
    bio?: string | null
    profileImageUrl?: string | null
    coverImageUrl?: string | null
    isCreator?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    videos?: VideoUncheckedCreateNestedManyWithoutUserInput
    comments?: CommentUncheckedCreateNestedManyWithoutUserInput
    likes?: LikeUncheckedCreateNestedManyWithoutUserInput
    videoViews?: VideoViewUncheckedCreateNestedManyWithoutUserInput
    following?: FollowerUncheckedCreateNestedManyWithoutFollowerInput
  }

  export type UserCreateOrConnectWithoutFollowersInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutFollowersInput, UserUncheckedCreateWithoutFollowersInput>
  }

  export type UserUpsertWithoutFollowingInput = {
    update: XOR<UserUpdateWithoutFollowingInput, UserUncheckedUpdateWithoutFollowingInput>
    create: XOR<UserCreateWithoutFollowingInput, UserUncheckedCreateWithoutFollowingInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutFollowingInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutFollowingInput, UserUncheckedUpdateWithoutFollowingInput>
  }

  export type UserUpdateWithoutFollowingInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    name?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isCreator?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    videos?: VideoUpdateManyWithoutUserNestedInput
    comments?: CommentUpdateManyWithoutUserNestedInput
    likes?: LikeUpdateManyWithoutUserNestedInput
    videoViews?: VideoViewUpdateManyWithoutUserNestedInput
    followers?: FollowerUpdateManyWithoutFollowingNestedInput
  }

  export type UserUncheckedUpdateWithoutFollowingInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    name?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isCreator?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    videos?: VideoUncheckedUpdateManyWithoutUserNestedInput
    comments?: CommentUncheckedUpdateManyWithoutUserNestedInput
    likes?: LikeUncheckedUpdateManyWithoutUserNestedInput
    videoViews?: VideoViewUncheckedUpdateManyWithoutUserNestedInput
    followers?: FollowerUncheckedUpdateManyWithoutFollowingNestedInput
  }

  export type UserUpsertWithoutFollowersInput = {
    update: XOR<UserUpdateWithoutFollowersInput, UserUncheckedUpdateWithoutFollowersInput>
    create: XOR<UserCreateWithoutFollowersInput, UserUncheckedCreateWithoutFollowersInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutFollowersInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutFollowersInput, UserUncheckedUpdateWithoutFollowersInput>
  }

  export type UserUpdateWithoutFollowersInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    name?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isCreator?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    videos?: VideoUpdateManyWithoutUserNestedInput
    comments?: CommentUpdateManyWithoutUserNestedInput
    likes?: LikeUpdateManyWithoutUserNestedInput
    videoViews?: VideoViewUpdateManyWithoutUserNestedInput
    following?: FollowerUpdateManyWithoutFollowerNestedInput
  }

  export type UserUncheckedUpdateWithoutFollowersInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    name?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isCreator?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    videos?: VideoUncheckedUpdateManyWithoutUserNestedInput
    comments?: CommentUncheckedUpdateManyWithoutUserNestedInput
    likes?: LikeUncheckedUpdateManyWithoutUserNestedInput
    videoViews?: VideoViewUncheckedUpdateManyWithoutUserNestedInput
    following?: FollowerUncheckedUpdateManyWithoutFollowerNestedInput
  }

  export type UserCreateWithoutVideosInput = {
    id: string
    email: string
    emailVerified?: boolean
    name?: string | null
    username?: string | null
    bio?: string | null
    profileImageUrl?: string | null
    coverImageUrl?: string | null
    isCreator?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    comments?: CommentCreateNestedManyWithoutUserInput
    likes?: LikeCreateNestedManyWithoutUserInput
    videoViews?: VideoViewCreateNestedManyWithoutUserInput
    followers?: FollowerCreateNestedManyWithoutFollowingInput
    following?: FollowerCreateNestedManyWithoutFollowerInput
  }

  export type UserUncheckedCreateWithoutVideosInput = {
    id: string
    email: string
    emailVerified?: boolean
    name?: string | null
    username?: string | null
    bio?: string | null
    profileImageUrl?: string | null
    coverImageUrl?: string | null
    isCreator?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    comments?: CommentUncheckedCreateNestedManyWithoutUserInput
    likes?: LikeUncheckedCreateNestedManyWithoutUserInput
    videoViews?: VideoViewUncheckedCreateNestedManyWithoutUserInput
    followers?: FollowerUncheckedCreateNestedManyWithoutFollowingInput
    following?: FollowerUncheckedCreateNestedManyWithoutFollowerInput
  }

  export type UserCreateOrConnectWithoutVideosInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutVideosInput, UserUncheckedCreateWithoutVideosInput>
  }

  export type VideoMetadataCreateWithoutVideoInput = {
    filename?: string | null
    fileSize?: number | null
    mimeType?: string | null
    width?: number | null
    height?: number | null
    frameRate?: number | null
    bitrate?: number | null
    originalUrl?: string | null
    uploadStatus?: string | null
    error?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VideoMetadataUncheckedCreateWithoutVideoInput = {
    id?: number
    filename?: string | null
    fileSize?: number | null
    mimeType?: string | null
    width?: number | null
    height?: number | null
    frameRate?: number | null
    bitrate?: number | null
    originalUrl?: string | null
    uploadStatus?: string | null
    error?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VideoMetadataCreateOrConnectWithoutVideoInput = {
    where: VideoMetadataWhereUniqueInput
    create: XOR<VideoMetadataCreateWithoutVideoInput, VideoMetadataUncheckedCreateWithoutVideoInput>
  }

  export type CommentCreateWithoutVideoInput = {
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutCommentsInput
  }

  export type CommentUncheckedCreateWithoutVideoInput = {
    id?: number
    content: string
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CommentCreateOrConnectWithoutVideoInput = {
    where: CommentWhereUniqueInput
    create: XOR<CommentCreateWithoutVideoInput, CommentUncheckedCreateWithoutVideoInput>
  }

  export type CommentCreateManyVideoInputEnvelope = {
    data: CommentCreateManyVideoInput | CommentCreateManyVideoInput[]
    skipDuplicates?: boolean
  }

  export type LikeCreateWithoutVideoInput = {
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutLikesInput
  }

  export type LikeUncheckedCreateWithoutVideoInput = {
    id?: number
    userId: string
    createdAt?: Date | string
  }

  export type LikeCreateOrConnectWithoutVideoInput = {
    where: LikeWhereUniqueInput
    create: XOR<LikeCreateWithoutVideoInput, LikeUncheckedCreateWithoutVideoInput>
  }

  export type LikeCreateManyVideoInputEnvelope = {
    data: LikeCreateManyVideoInput | LikeCreateManyVideoInput[]
    skipDuplicates?: boolean
  }

  export type VideoViewCreateWithoutVideoInput = {
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
    user?: UserCreateNestedOneWithoutVideoViewsInput
  }

  export type VideoViewUncheckedCreateWithoutVideoInput = {
    id?: number
    userId?: string | null
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
  }

  export type VideoViewCreateOrConnectWithoutVideoInput = {
    where: VideoViewWhereUniqueInput
    create: XOR<VideoViewCreateWithoutVideoInput, VideoViewUncheckedCreateWithoutVideoInput>
  }

  export type VideoViewCreateManyVideoInputEnvelope = {
    data: VideoViewCreateManyVideoInput | VideoViewCreateManyVideoInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutVideosInput = {
    update: XOR<UserUpdateWithoutVideosInput, UserUncheckedUpdateWithoutVideosInput>
    create: XOR<UserCreateWithoutVideosInput, UserUncheckedCreateWithoutVideosInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutVideosInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutVideosInput, UserUncheckedUpdateWithoutVideosInput>
  }

  export type UserUpdateWithoutVideosInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    name?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isCreator?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    comments?: CommentUpdateManyWithoutUserNestedInput
    likes?: LikeUpdateManyWithoutUserNestedInput
    videoViews?: VideoViewUpdateManyWithoutUserNestedInput
    followers?: FollowerUpdateManyWithoutFollowingNestedInput
    following?: FollowerUpdateManyWithoutFollowerNestedInput
  }

  export type UserUncheckedUpdateWithoutVideosInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    name?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isCreator?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    comments?: CommentUncheckedUpdateManyWithoutUserNestedInput
    likes?: LikeUncheckedUpdateManyWithoutUserNestedInput
    videoViews?: VideoViewUncheckedUpdateManyWithoutUserNestedInput
    followers?: FollowerUncheckedUpdateManyWithoutFollowingNestedInput
    following?: FollowerUncheckedUpdateManyWithoutFollowerNestedInput
  }

  export type VideoMetadataUpsertWithoutVideoInput = {
    update: XOR<VideoMetadataUpdateWithoutVideoInput, VideoMetadataUncheckedUpdateWithoutVideoInput>
    create: XOR<VideoMetadataCreateWithoutVideoInput, VideoMetadataUncheckedCreateWithoutVideoInput>
    where?: VideoMetadataWhereInput
  }

  export type VideoMetadataUpdateToOneWithWhereWithoutVideoInput = {
    where?: VideoMetadataWhereInput
    data: XOR<VideoMetadataUpdateWithoutVideoInput, VideoMetadataUncheckedUpdateWithoutVideoInput>
  }

  export type VideoMetadataUpdateWithoutVideoInput = {
    filename?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    frameRate?: NullableFloatFieldUpdateOperationsInput | number | null
    bitrate?: NullableIntFieldUpdateOperationsInput | number | null
    originalUrl?: NullableStringFieldUpdateOperationsInput | string | null
    uploadStatus?: NullableStringFieldUpdateOperationsInput | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VideoMetadataUncheckedUpdateWithoutVideoInput = {
    id?: IntFieldUpdateOperationsInput | number
    filename?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    frameRate?: NullableFloatFieldUpdateOperationsInput | number | null
    bitrate?: NullableIntFieldUpdateOperationsInput | number | null
    originalUrl?: NullableStringFieldUpdateOperationsInput | string | null
    uploadStatus?: NullableStringFieldUpdateOperationsInput | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommentUpsertWithWhereUniqueWithoutVideoInput = {
    where: CommentWhereUniqueInput
    update: XOR<CommentUpdateWithoutVideoInput, CommentUncheckedUpdateWithoutVideoInput>
    create: XOR<CommentCreateWithoutVideoInput, CommentUncheckedCreateWithoutVideoInput>
  }

  export type CommentUpdateWithWhereUniqueWithoutVideoInput = {
    where: CommentWhereUniqueInput
    data: XOR<CommentUpdateWithoutVideoInput, CommentUncheckedUpdateWithoutVideoInput>
  }

  export type CommentUpdateManyWithWhereWithoutVideoInput = {
    where: CommentScalarWhereInput
    data: XOR<CommentUpdateManyMutationInput, CommentUncheckedUpdateManyWithoutVideoInput>
  }

  export type LikeUpsertWithWhereUniqueWithoutVideoInput = {
    where: LikeWhereUniqueInput
    update: XOR<LikeUpdateWithoutVideoInput, LikeUncheckedUpdateWithoutVideoInput>
    create: XOR<LikeCreateWithoutVideoInput, LikeUncheckedCreateWithoutVideoInput>
  }

  export type LikeUpdateWithWhereUniqueWithoutVideoInput = {
    where: LikeWhereUniqueInput
    data: XOR<LikeUpdateWithoutVideoInput, LikeUncheckedUpdateWithoutVideoInput>
  }

  export type LikeUpdateManyWithWhereWithoutVideoInput = {
    where: LikeScalarWhereInput
    data: XOR<LikeUpdateManyMutationInput, LikeUncheckedUpdateManyWithoutVideoInput>
  }

  export type VideoViewUpsertWithWhereUniqueWithoutVideoInput = {
    where: VideoViewWhereUniqueInput
    update: XOR<VideoViewUpdateWithoutVideoInput, VideoViewUncheckedUpdateWithoutVideoInput>
    create: XOR<VideoViewCreateWithoutVideoInput, VideoViewUncheckedCreateWithoutVideoInput>
  }

  export type VideoViewUpdateWithWhereUniqueWithoutVideoInput = {
    where: VideoViewWhereUniqueInput
    data: XOR<VideoViewUpdateWithoutVideoInput, VideoViewUncheckedUpdateWithoutVideoInput>
  }

  export type VideoViewUpdateManyWithWhereWithoutVideoInput = {
    where: VideoViewScalarWhereInput
    data: XOR<VideoViewUpdateManyMutationInput, VideoViewUncheckedUpdateManyWithoutVideoInput>
  }

  export type VideoCreateWithoutMetadataInput = {
    title: string
    description?: string | null
    assetId?: string | null
    uploadId?: string | null
    playbackId?: string | null
    status?: string
    duration?: number | null
    aspectRatio?: string | null
    thumbnailUrl?: string | null
    videoUrl?: string | null
    isPublished?: boolean
    isPremium?: boolean
    price?: number | null
    viewCount?: number
    likeCount?: number
    commentCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutVideosInput
    comments?: CommentCreateNestedManyWithoutVideoInput
    likes?: LikeCreateNestedManyWithoutVideoInput
    views?: VideoViewCreateNestedManyWithoutVideoInput
  }

  export type VideoUncheckedCreateWithoutMetadataInput = {
    id?: number
    user_id: string
    title: string
    description?: string | null
    assetId?: string | null
    uploadId?: string | null
    playbackId?: string | null
    status?: string
    duration?: number | null
    aspectRatio?: string | null
    thumbnailUrl?: string | null
    videoUrl?: string | null
    isPublished?: boolean
    isPremium?: boolean
    price?: number | null
    viewCount?: number
    likeCount?: number
    commentCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    comments?: CommentUncheckedCreateNestedManyWithoutVideoInput
    likes?: LikeUncheckedCreateNestedManyWithoutVideoInput
    views?: VideoViewUncheckedCreateNestedManyWithoutVideoInput
  }

  export type VideoCreateOrConnectWithoutMetadataInput = {
    where: VideoWhereUniqueInput
    create: XOR<VideoCreateWithoutMetadataInput, VideoUncheckedCreateWithoutMetadataInput>
  }

  export type VideoUpsertWithoutMetadataInput = {
    update: XOR<VideoUpdateWithoutMetadataInput, VideoUncheckedUpdateWithoutMetadataInput>
    create: XOR<VideoCreateWithoutMetadataInput, VideoUncheckedCreateWithoutMetadataInput>
    where?: VideoWhereInput
  }

  export type VideoUpdateToOneWithWhereWithoutMetadataInput = {
    where?: VideoWhereInput
    data: XOR<VideoUpdateWithoutMetadataInput, VideoUncheckedUpdateWithoutMetadataInput>
  }

  export type VideoUpdateWithoutMetadataInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    assetId?: NullableStringFieldUpdateOperationsInput | string | null
    uploadId?: NullableStringFieldUpdateOperationsInput | string | null
    playbackId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    duration?: NullableFloatFieldUpdateOperationsInput | number | null
    aspectRatio?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnailUrl?: NullableStringFieldUpdateOperationsInput | string | null
    videoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    isPremium?: BoolFieldUpdateOperationsInput | boolean
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    viewCount?: IntFieldUpdateOperationsInput | number
    likeCount?: IntFieldUpdateOperationsInput | number
    commentCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutVideosNestedInput
    comments?: CommentUpdateManyWithoutVideoNestedInput
    likes?: LikeUpdateManyWithoutVideoNestedInput
    views?: VideoViewUpdateManyWithoutVideoNestedInput
  }

  export type VideoUncheckedUpdateWithoutMetadataInput = {
    id?: IntFieldUpdateOperationsInput | number
    user_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    assetId?: NullableStringFieldUpdateOperationsInput | string | null
    uploadId?: NullableStringFieldUpdateOperationsInput | string | null
    playbackId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    duration?: NullableFloatFieldUpdateOperationsInput | number | null
    aspectRatio?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnailUrl?: NullableStringFieldUpdateOperationsInput | string | null
    videoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    isPremium?: BoolFieldUpdateOperationsInput | boolean
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    viewCount?: IntFieldUpdateOperationsInput | number
    likeCount?: IntFieldUpdateOperationsInput | number
    commentCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    comments?: CommentUncheckedUpdateManyWithoutVideoNestedInput
    likes?: LikeUncheckedUpdateManyWithoutVideoNestedInput
    views?: VideoViewUncheckedUpdateManyWithoutVideoNestedInput
  }

  export type UserCreateWithoutCommentsInput = {
    id: string
    email: string
    emailVerified?: boolean
    name?: string | null
    username?: string | null
    bio?: string | null
    profileImageUrl?: string | null
    coverImageUrl?: string | null
    isCreator?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    videos?: VideoCreateNestedManyWithoutUserInput
    likes?: LikeCreateNestedManyWithoutUserInput
    videoViews?: VideoViewCreateNestedManyWithoutUserInput
    followers?: FollowerCreateNestedManyWithoutFollowingInput
    following?: FollowerCreateNestedManyWithoutFollowerInput
  }

  export type UserUncheckedCreateWithoutCommentsInput = {
    id: string
    email: string
    emailVerified?: boolean
    name?: string | null
    username?: string | null
    bio?: string | null
    profileImageUrl?: string | null
    coverImageUrl?: string | null
    isCreator?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    videos?: VideoUncheckedCreateNestedManyWithoutUserInput
    likes?: LikeUncheckedCreateNestedManyWithoutUserInput
    videoViews?: VideoViewUncheckedCreateNestedManyWithoutUserInput
    followers?: FollowerUncheckedCreateNestedManyWithoutFollowingInput
    following?: FollowerUncheckedCreateNestedManyWithoutFollowerInput
  }

  export type UserCreateOrConnectWithoutCommentsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCommentsInput, UserUncheckedCreateWithoutCommentsInput>
  }

  export type VideoCreateWithoutCommentsInput = {
    title: string
    description?: string | null
    assetId?: string | null
    uploadId?: string | null
    playbackId?: string | null
    status?: string
    duration?: number | null
    aspectRatio?: string | null
    thumbnailUrl?: string | null
    videoUrl?: string | null
    isPublished?: boolean
    isPremium?: boolean
    price?: number | null
    viewCount?: number
    likeCount?: number
    commentCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutVideosInput
    metadata?: VideoMetadataCreateNestedOneWithoutVideoInput
    likes?: LikeCreateNestedManyWithoutVideoInput
    views?: VideoViewCreateNestedManyWithoutVideoInput
  }

  export type VideoUncheckedCreateWithoutCommentsInput = {
    id?: number
    user_id: string
    title: string
    description?: string | null
    assetId?: string | null
    uploadId?: string | null
    playbackId?: string | null
    status?: string
    duration?: number | null
    aspectRatio?: string | null
    thumbnailUrl?: string | null
    videoUrl?: string | null
    isPublished?: boolean
    isPremium?: boolean
    price?: number | null
    viewCount?: number
    likeCount?: number
    commentCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    metadata?: VideoMetadataUncheckedCreateNestedOneWithoutVideoInput
    likes?: LikeUncheckedCreateNestedManyWithoutVideoInput
    views?: VideoViewUncheckedCreateNestedManyWithoutVideoInput
  }

  export type VideoCreateOrConnectWithoutCommentsInput = {
    where: VideoWhereUniqueInput
    create: XOR<VideoCreateWithoutCommentsInput, VideoUncheckedCreateWithoutCommentsInput>
  }

  export type UserUpsertWithoutCommentsInput = {
    update: XOR<UserUpdateWithoutCommentsInput, UserUncheckedUpdateWithoutCommentsInput>
    create: XOR<UserCreateWithoutCommentsInput, UserUncheckedCreateWithoutCommentsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCommentsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCommentsInput, UserUncheckedUpdateWithoutCommentsInput>
  }

  export type UserUpdateWithoutCommentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    name?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isCreator?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    videos?: VideoUpdateManyWithoutUserNestedInput
    likes?: LikeUpdateManyWithoutUserNestedInput
    videoViews?: VideoViewUpdateManyWithoutUserNestedInput
    followers?: FollowerUpdateManyWithoutFollowingNestedInput
    following?: FollowerUpdateManyWithoutFollowerNestedInput
  }

  export type UserUncheckedUpdateWithoutCommentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    name?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isCreator?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    videos?: VideoUncheckedUpdateManyWithoutUserNestedInput
    likes?: LikeUncheckedUpdateManyWithoutUserNestedInput
    videoViews?: VideoViewUncheckedUpdateManyWithoutUserNestedInput
    followers?: FollowerUncheckedUpdateManyWithoutFollowingNestedInput
    following?: FollowerUncheckedUpdateManyWithoutFollowerNestedInput
  }

  export type VideoUpsertWithoutCommentsInput = {
    update: XOR<VideoUpdateWithoutCommentsInput, VideoUncheckedUpdateWithoutCommentsInput>
    create: XOR<VideoCreateWithoutCommentsInput, VideoUncheckedCreateWithoutCommentsInput>
    where?: VideoWhereInput
  }

  export type VideoUpdateToOneWithWhereWithoutCommentsInput = {
    where?: VideoWhereInput
    data: XOR<VideoUpdateWithoutCommentsInput, VideoUncheckedUpdateWithoutCommentsInput>
  }

  export type VideoUpdateWithoutCommentsInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    assetId?: NullableStringFieldUpdateOperationsInput | string | null
    uploadId?: NullableStringFieldUpdateOperationsInput | string | null
    playbackId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    duration?: NullableFloatFieldUpdateOperationsInput | number | null
    aspectRatio?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnailUrl?: NullableStringFieldUpdateOperationsInput | string | null
    videoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    isPremium?: BoolFieldUpdateOperationsInput | boolean
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    viewCount?: IntFieldUpdateOperationsInput | number
    likeCount?: IntFieldUpdateOperationsInput | number
    commentCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutVideosNestedInput
    metadata?: VideoMetadataUpdateOneWithoutVideoNestedInput
    likes?: LikeUpdateManyWithoutVideoNestedInput
    views?: VideoViewUpdateManyWithoutVideoNestedInput
  }

  export type VideoUncheckedUpdateWithoutCommentsInput = {
    id?: IntFieldUpdateOperationsInput | number
    user_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    assetId?: NullableStringFieldUpdateOperationsInput | string | null
    uploadId?: NullableStringFieldUpdateOperationsInput | string | null
    playbackId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    duration?: NullableFloatFieldUpdateOperationsInput | number | null
    aspectRatio?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnailUrl?: NullableStringFieldUpdateOperationsInput | string | null
    videoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    isPremium?: BoolFieldUpdateOperationsInput | boolean
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    viewCount?: IntFieldUpdateOperationsInput | number
    likeCount?: IntFieldUpdateOperationsInput | number
    commentCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: VideoMetadataUncheckedUpdateOneWithoutVideoNestedInput
    likes?: LikeUncheckedUpdateManyWithoutVideoNestedInput
    views?: VideoViewUncheckedUpdateManyWithoutVideoNestedInput
  }

  export type UserCreateWithoutLikesInput = {
    id: string
    email: string
    emailVerified?: boolean
    name?: string | null
    username?: string | null
    bio?: string | null
    profileImageUrl?: string | null
    coverImageUrl?: string | null
    isCreator?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    videos?: VideoCreateNestedManyWithoutUserInput
    comments?: CommentCreateNestedManyWithoutUserInput
    videoViews?: VideoViewCreateNestedManyWithoutUserInput
    followers?: FollowerCreateNestedManyWithoutFollowingInput
    following?: FollowerCreateNestedManyWithoutFollowerInput
  }

  export type UserUncheckedCreateWithoutLikesInput = {
    id: string
    email: string
    emailVerified?: boolean
    name?: string | null
    username?: string | null
    bio?: string | null
    profileImageUrl?: string | null
    coverImageUrl?: string | null
    isCreator?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    videos?: VideoUncheckedCreateNestedManyWithoutUserInput
    comments?: CommentUncheckedCreateNestedManyWithoutUserInput
    videoViews?: VideoViewUncheckedCreateNestedManyWithoutUserInput
    followers?: FollowerUncheckedCreateNestedManyWithoutFollowingInput
    following?: FollowerUncheckedCreateNestedManyWithoutFollowerInput
  }

  export type UserCreateOrConnectWithoutLikesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutLikesInput, UserUncheckedCreateWithoutLikesInput>
  }

  export type VideoCreateWithoutLikesInput = {
    title: string
    description?: string | null
    assetId?: string | null
    uploadId?: string | null
    playbackId?: string | null
    status?: string
    duration?: number | null
    aspectRatio?: string | null
    thumbnailUrl?: string | null
    videoUrl?: string | null
    isPublished?: boolean
    isPremium?: boolean
    price?: number | null
    viewCount?: number
    likeCount?: number
    commentCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutVideosInput
    metadata?: VideoMetadataCreateNestedOneWithoutVideoInput
    comments?: CommentCreateNestedManyWithoutVideoInput
    views?: VideoViewCreateNestedManyWithoutVideoInput
  }

  export type VideoUncheckedCreateWithoutLikesInput = {
    id?: number
    user_id: string
    title: string
    description?: string | null
    assetId?: string | null
    uploadId?: string | null
    playbackId?: string | null
    status?: string
    duration?: number | null
    aspectRatio?: string | null
    thumbnailUrl?: string | null
    videoUrl?: string | null
    isPublished?: boolean
    isPremium?: boolean
    price?: number | null
    viewCount?: number
    likeCount?: number
    commentCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    metadata?: VideoMetadataUncheckedCreateNestedOneWithoutVideoInput
    comments?: CommentUncheckedCreateNestedManyWithoutVideoInput
    views?: VideoViewUncheckedCreateNestedManyWithoutVideoInput
  }

  export type VideoCreateOrConnectWithoutLikesInput = {
    where: VideoWhereUniqueInput
    create: XOR<VideoCreateWithoutLikesInput, VideoUncheckedCreateWithoutLikesInput>
  }

  export type UserUpsertWithoutLikesInput = {
    update: XOR<UserUpdateWithoutLikesInput, UserUncheckedUpdateWithoutLikesInput>
    create: XOR<UserCreateWithoutLikesInput, UserUncheckedCreateWithoutLikesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutLikesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutLikesInput, UserUncheckedUpdateWithoutLikesInput>
  }

  export type UserUpdateWithoutLikesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    name?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isCreator?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    videos?: VideoUpdateManyWithoutUserNestedInput
    comments?: CommentUpdateManyWithoutUserNestedInput
    videoViews?: VideoViewUpdateManyWithoutUserNestedInput
    followers?: FollowerUpdateManyWithoutFollowingNestedInput
    following?: FollowerUpdateManyWithoutFollowerNestedInput
  }

  export type UserUncheckedUpdateWithoutLikesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    name?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isCreator?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    videos?: VideoUncheckedUpdateManyWithoutUserNestedInput
    comments?: CommentUncheckedUpdateManyWithoutUserNestedInput
    videoViews?: VideoViewUncheckedUpdateManyWithoutUserNestedInput
    followers?: FollowerUncheckedUpdateManyWithoutFollowingNestedInput
    following?: FollowerUncheckedUpdateManyWithoutFollowerNestedInput
  }

  export type VideoUpsertWithoutLikesInput = {
    update: XOR<VideoUpdateWithoutLikesInput, VideoUncheckedUpdateWithoutLikesInput>
    create: XOR<VideoCreateWithoutLikesInput, VideoUncheckedCreateWithoutLikesInput>
    where?: VideoWhereInput
  }

  export type VideoUpdateToOneWithWhereWithoutLikesInput = {
    where?: VideoWhereInput
    data: XOR<VideoUpdateWithoutLikesInput, VideoUncheckedUpdateWithoutLikesInput>
  }

  export type VideoUpdateWithoutLikesInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    assetId?: NullableStringFieldUpdateOperationsInput | string | null
    uploadId?: NullableStringFieldUpdateOperationsInput | string | null
    playbackId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    duration?: NullableFloatFieldUpdateOperationsInput | number | null
    aspectRatio?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnailUrl?: NullableStringFieldUpdateOperationsInput | string | null
    videoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    isPremium?: BoolFieldUpdateOperationsInput | boolean
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    viewCount?: IntFieldUpdateOperationsInput | number
    likeCount?: IntFieldUpdateOperationsInput | number
    commentCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutVideosNestedInput
    metadata?: VideoMetadataUpdateOneWithoutVideoNestedInput
    comments?: CommentUpdateManyWithoutVideoNestedInput
    views?: VideoViewUpdateManyWithoutVideoNestedInput
  }

  export type VideoUncheckedUpdateWithoutLikesInput = {
    id?: IntFieldUpdateOperationsInput | number
    user_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    assetId?: NullableStringFieldUpdateOperationsInput | string | null
    uploadId?: NullableStringFieldUpdateOperationsInput | string | null
    playbackId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    duration?: NullableFloatFieldUpdateOperationsInput | number | null
    aspectRatio?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnailUrl?: NullableStringFieldUpdateOperationsInput | string | null
    videoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    isPremium?: BoolFieldUpdateOperationsInput | boolean
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    viewCount?: IntFieldUpdateOperationsInput | number
    likeCount?: IntFieldUpdateOperationsInput | number
    commentCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: VideoMetadataUncheckedUpdateOneWithoutVideoNestedInput
    comments?: CommentUncheckedUpdateManyWithoutVideoNestedInput
    views?: VideoViewUncheckedUpdateManyWithoutVideoNestedInput
  }

  export type UserCreateWithoutVideoViewsInput = {
    id: string
    email: string
    emailVerified?: boolean
    name?: string | null
    username?: string | null
    bio?: string | null
    profileImageUrl?: string | null
    coverImageUrl?: string | null
    isCreator?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    videos?: VideoCreateNestedManyWithoutUserInput
    comments?: CommentCreateNestedManyWithoutUserInput
    likes?: LikeCreateNestedManyWithoutUserInput
    followers?: FollowerCreateNestedManyWithoutFollowingInput
    following?: FollowerCreateNestedManyWithoutFollowerInput
  }

  export type UserUncheckedCreateWithoutVideoViewsInput = {
    id: string
    email: string
    emailVerified?: boolean
    name?: string | null
    username?: string | null
    bio?: string | null
    profileImageUrl?: string | null
    coverImageUrl?: string | null
    isCreator?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    videos?: VideoUncheckedCreateNestedManyWithoutUserInput
    comments?: CommentUncheckedCreateNestedManyWithoutUserInput
    likes?: LikeUncheckedCreateNestedManyWithoutUserInput
    followers?: FollowerUncheckedCreateNestedManyWithoutFollowingInput
    following?: FollowerUncheckedCreateNestedManyWithoutFollowerInput
  }

  export type UserCreateOrConnectWithoutVideoViewsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutVideoViewsInput, UserUncheckedCreateWithoutVideoViewsInput>
  }

  export type VideoCreateWithoutViewsInput = {
    title: string
    description?: string | null
    assetId?: string | null
    uploadId?: string | null
    playbackId?: string | null
    status?: string
    duration?: number | null
    aspectRatio?: string | null
    thumbnailUrl?: string | null
    videoUrl?: string | null
    isPublished?: boolean
    isPremium?: boolean
    price?: number | null
    viewCount?: number
    likeCount?: number
    commentCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutVideosInput
    metadata?: VideoMetadataCreateNestedOneWithoutVideoInput
    comments?: CommentCreateNestedManyWithoutVideoInput
    likes?: LikeCreateNestedManyWithoutVideoInput
  }

  export type VideoUncheckedCreateWithoutViewsInput = {
    id?: number
    user_id: string
    title: string
    description?: string | null
    assetId?: string | null
    uploadId?: string | null
    playbackId?: string | null
    status?: string
    duration?: number | null
    aspectRatio?: string | null
    thumbnailUrl?: string | null
    videoUrl?: string | null
    isPublished?: boolean
    isPremium?: boolean
    price?: number | null
    viewCount?: number
    likeCount?: number
    commentCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    metadata?: VideoMetadataUncheckedCreateNestedOneWithoutVideoInput
    comments?: CommentUncheckedCreateNestedManyWithoutVideoInput
    likes?: LikeUncheckedCreateNestedManyWithoutVideoInput
  }

  export type VideoCreateOrConnectWithoutViewsInput = {
    where: VideoWhereUniqueInput
    create: XOR<VideoCreateWithoutViewsInput, VideoUncheckedCreateWithoutViewsInput>
  }

  export type UserUpsertWithoutVideoViewsInput = {
    update: XOR<UserUpdateWithoutVideoViewsInput, UserUncheckedUpdateWithoutVideoViewsInput>
    create: XOR<UserCreateWithoutVideoViewsInput, UserUncheckedCreateWithoutVideoViewsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutVideoViewsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutVideoViewsInput, UserUncheckedUpdateWithoutVideoViewsInput>
  }

  export type UserUpdateWithoutVideoViewsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    name?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isCreator?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    videos?: VideoUpdateManyWithoutUserNestedInput
    comments?: CommentUpdateManyWithoutUserNestedInput
    likes?: LikeUpdateManyWithoutUserNestedInput
    followers?: FollowerUpdateManyWithoutFollowingNestedInput
    following?: FollowerUpdateManyWithoutFollowerNestedInput
  }

  export type UserUncheckedUpdateWithoutVideoViewsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    name?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isCreator?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    videos?: VideoUncheckedUpdateManyWithoutUserNestedInput
    comments?: CommentUncheckedUpdateManyWithoutUserNestedInput
    likes?: LikeUncheckedUpdateManyWithoutUserNestedInput
    followers?: FollowerUncheckedUpdateManyWithoutFollowingNestedInput
    following?: FollowerUncheckedUpdateManyWithoutFollowerNestedInput
  }

  export type VideoUpsertWithoutViewsInput = {
    update: XOR<VideoUpdateWithoutViewsInput, VideoUncheckedUpdateWithoutViewsInput>
    create: XOR<VideoCreateWithoutViewsInput, VideoUncheckedCreateWithoutViewsInput>
    where?: VideoWhereInput
  }

  export type VideoUpdateToOneWithWhereWithoutViewsInput = {
    where?: VideoWhereInput
    data: XOR<VideoUpdateWithoutViewsInput, VideoUncheckedUpdateWithoutViewsInput>
  }

  export type VideoUpdateWithoutViewsInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    assetId?: NullableStringFieldUpdateOperationsInput | string | null
    uploadId?: NullableStringFieldUpdateOperationsInput | string | null
    playbackId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    duration?: NullableFloatFieldUpdateOperationsInput | number | null
    aspectRatio?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnailUrl?: NullableStringFieldUpdateOperationsInput | string | null
    videoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    isPremium?: BoolFieldUpdateOperationsInput | boolean
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    viewCount?: IntFieldUpdateOperationsInput | number
    likeCount?: IntFieldUpdateOperationsInput | number
    commentCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutVideosNestedInput
    metadata?: VideoMetadataUpdateOneWithoutVideoNestedInput
    comments?: CommentUpdateManyWithoutVideoNestedInput
    likes?: LikeUpdateManyWithoutVideoNestedInput
  }

  export type VideoUncheckedUpdateWithoutViewsInput = {
    id?: IntFieldUpdateOperationsInput | number
    user_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    assetId?: NullableStringFieldUpdateOperationsInput | string | null
    uploadId?: NullableStringFieldUpdateOperationsInput | string | null
    playbackId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    duration?: NullableFloatFieldUpdateOperationsInput | number | null
    aspectRatio?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnailUrl?: NullableStringFieldUpdateOperationsInput | string | null
    videoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    isPremium?: BoolFieldUpdateOperationsInput | boolean
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    viewCount?: IntFieldUpdateOperationsInput | number
    likeCount?: IntFieldUpdateOperationsInput | number
    commentCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: VideoMetadataUncheckedUpdateOneWithoutVideoNestedInput
    comments?: CommentUncheckedUpdateManyWithoutVideoNestedInput
    likes?: LikeUncheckedUpdateManyWithoutVideoNestedInput
  }

  export type VideoCreateManyUserInput = {
    id?: number
    title: string
    description?: string | null
    assetId?: string | null
    uploadId?: string | null
    playbackId?: string | null
    status?: string
    duration?: number | null
    aspectRatio?: string | null
    thumbnailUrl?: string | null
    videoUrl?: string | null
    isPublished?: boolean
    isPremium?: boolean
    price?: number | null
    viewCount?: number
    likeCount?: number
    commentCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CommentCreateManyUserInput = {
    id?: number
    content: string
    videoId: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LikeCreateManyUserInput = {
    id?: number
    videoId: number
    createdAt?: Date | string
  }

  export type VideoViewCreateManyUserInput = {
    id?: number
    videoId: number
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
  }

  export type FollowerCreateManyFollowingInput = {
    id?: string
    followerId: string
    createdAt?: Date | string
  }

  export type FollowerCreateManyFollowerInput = {
    id?: string
    followingId: string
    createdAt?: Date | string
  }

  export type VideoUpdateWithoutUserInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    assetId?: NullableStringFieldUpdateOperationsInput | string | null
    uploadId?: NullableStringFieldUpdateOperationsInput | string | null
    playbackId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    duration?: NullableFloatFieldUpdateOperationsInput | number | null
    aspectRatio?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnailUrl?: NullableStringFieldUpdateOperationsInput | string | null
    videoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    isPremium?: BoolFieldUpdateOperationsInput | boolean
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    viewCount?: IntFieldUpdateOperationsInput | number
    likeCount?: IntFieldUpdateOperationsInput | number
    commentCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: VideoMetadataUpdateOneWithoutVideoNestedInput
    comments?: CommentUpdateManyWithoutVideoNestedInput
    likes?: LikeUpdateManyWithoutVideoNestedInput
    views?: VideoViewUpdateManyWithoutVideoNestedInput
  }

  export type VideoUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    assetId?: NullableStringFieldUpdateOperationsInput | string | null
    uploadId?: NullableStringFieldUpdateOperationsInput | string | null
    playbackId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    duration?: NullableFloatFieldUpdateOperationsInput | number | null
    aspectRatio?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnailUrl?: NullableStringFieldUpdateOperationsInput | string | null
    videoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    isPremium?: BoolFieldUpdateOperationsInput | boolean
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    viewCount?: IntFieldUpdateOperationsInput | number
    likeCount?: IntFieldUpdateOperationsInput | number
    commentCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: VideoMetadataUncheckedUpdateOneWithoutVideoNestedInput
    comments?: CommentUncheckedUpdateManyWithoutVideoNestedInput
    likes?: LikeUncheckedUpdateManyWithoutVideoNestedInput
    views?: VideoViewUncheckedUpdateManyWithoutVideoNestedInput
  }

  export type VideoUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    assetId?: NullableStringFieldUpdateOperationsInput | string | null
    uploadId?: NullableStringFieldUpdateOperationsInput | string | null
    playbackId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    duration?: NullableFloatFieldUpdateOperationsInput | number | null
    aspectRatio?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnailUrl?: NullableStringFieldUpdateOperationsInput | string | null
    videoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    isPremium?: BoolFieldUpdateOperationsInput | boolean
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    viewCount?: IntFieldUpdateOperationsInput | number
    likeCount?: IntFieldUpdateOperationsInput | number
    commentCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommentUpdateWithoutUserInput = {
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    video?: VideoUpdateOneRequiredWithoutCommentsNestedInput
  }

  export type CommentUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    videoId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommentUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    videoId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LikeUpdateWithoutUserInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    video?: VideoUpdateOneRequiredWithoutLikesNestedInput
  }

  export type LikeUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    videoId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LikeUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    videoId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VideoViewUpdateWithoutUserInput = {
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    video?: VideoUpdateOneRequiredWithoutViewsNestedInput
  }

  export type VideoViewUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    videoId?: IntFieldUpdateOperationsInput | number
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VideoViewUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    videoId?: IntFieldUpdateOperationsInput | number
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FollowerUpdateWithoutFollowingInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    follower?: UserUpdateOneRequiredWithoutFollowingNestedInput
  }

  export type FollowerUncheckedUpdateWithoutFollowingInput = {
    id?: StringFieldUpdateOperationsInput | string
    followerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FollowerUncheckedUpdateManyWithoutFollowingInput = {
    id?: StringFieldUpdateOperationsInput | string
    followerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FollowerUpdateWithoutFollowerInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    following?: UserUpdateOneRequiredWithoutFollowersNestedInput
  }

  export type FollowerUncheckedUpdateWithoutFollowerInput = {
    id?: StringFieldUpdateOperationsInput | string
    followingId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FollowerUncheckedUpdateManyWithoutFollowerInput = {
    id?: StringFieldUpdateOperationsInput | string
    followingId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommentCreateManyVideoInput = {
    id?: number
    content: string
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LikeCreateManyVideoInput = {
    id?: number
    userId: string
    createdAt?: Date | string
  }

  export type VideoViewCreateManyVideoInput = {
    id?: number
    userId?: string | null
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
  }

  export type CommentUpdateWithoutVideoInput = {
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutCommentsNestedInput
  }

  export type CommentUncheckedUpdateWithoutVideoInput = {
    id?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommentUncheckedUpdateManyWithoutVideoInput = {
    id?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LikeUpdateWithoutVideoInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutLikesNestedInput
  }

  export type LikeUncheckedUpdateWithoutVideoInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LikeUncheckedUpdateManyWithoutVideoInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VideoViewUpdateWithoutVideoInput = {
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutVideoViewsNestedInput
  }

  export type VideoViewUncheckedUpdateWithoutVideoInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VideoViewUncheckedUpdateManyWithoutVideoInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}