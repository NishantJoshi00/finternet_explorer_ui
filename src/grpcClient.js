import {DriverClient, DriverDetailsClient, ExecutionClient} from './service_grpc_web_pb';
import {ListResolverRequest, DriverDetailsRequest, ExecutionRequest, LoadDriverRequest, BinaryType} from './service_pb';

const API_DOMAIN = 'http://127.0.0.1:8080'

function createDriverClient() {
    return new DriverClient(API_DOMAIN, null, null)
}

function createDriverDetailClient() {
    return new DriverDetailsClient(API_DOMAIN, null, null)
}

function createExecutionClient() {
    return new ExecutionClient(API_DOMAIN, null, null);
  }

export const getDriverList = () => {
    return new Promise((resolve, reject)=>{
        const driverDetailsClient = createDriverDetailClient()
        const request = new DriverDetailsRequest()
        driverDetailsClient.sendDetails(request, {}, (err, response) => {
            if(err) {
                reject(err);
                return
            }
            resolve(response.toObject())
        })
    })
}

export const getResolverList = () => {
    return new Promise((resolve, reject)=>{
        const driverClient = createDriverClient()
        const request = new ListResolverRequest()
        driverClient.listResolver(request, {}, (err, response) => {
            if(err) {
                reject(err);
                return
            }
            resolve(response.toObject())
        })
    })
}

export const executeCommand = (executeData) => {
    return new Promise(async(resolve, reject) => {
      const executeClient = createExecutionClient()
      const request = new ExecutionRequest()
      const {name, input, type, binary} = executeData

      const buffer = await binary.arrayBuffer();

      request
        .setName(name)
        .setInput(input)
        .setType(type === "WASM" ? BinaryType.WASM : BinaryType.WAT)
        .setBinary(new Uint8Array(buffer));

      executeClient.execute(request, executeData, (err, response) => {
        if (err) {
          reject(err);
          return
        }
        resolve(response.getMessage())
      })
    })
  }

  export const loadDriver = (driverData) => {
    return new Promise(async (resolve, reject) => {
      const driverClient = createDriverClient()
      const request = new LoadDriverRequest()
      const {driverName, driverVersion, driverType, driverBinary} = driverData

      const buffer = await driverBinary.arrayBuffer();

      request
        .setDriverName(driverName)
        .setDriverVersion(driverVersion)
        .setDriverType(driverType === "WASM" ? BinaryType.WASM : BinaryType.WAT)
        .setDriverBinary(new Uint8Array(buffer));

      driverClient.loadDriver(request, driverData, (err, response) => {
        if (err) {
          reject(err);
          return
        }
        resolve(response.getMessage())
      })
    })
  }