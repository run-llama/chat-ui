/**
 * Example usage of the generated API client
 * 
 * This file demonstrates how to use the API client once it's generated.
 * Run `npm run generate` first to create the client code.
 */

// Uncomment the imports below after running `npm run generate`

/*
import { client } from './generated/client';
import { 
  DeploymentsService, 
  TasksService, 
  SessionsService 
} from './generated/services';

// Configure the base URL for your API
client.setConfig({
  baseUrl: 'http://localhost:8000' // Replace with your actual API URL
});

// Example: Get all deployments
export async function getAllDeployments() {
  try {
    const deployments = await DeploymentsService.readDeploymentsDeploymentsGet();
    console.log('Deployments:', deployments);
    return deployments;
  } catch (error) {
    console.error('Error fetching deployments:', error);
    throw error;
  }
}

// Example: Create a new session
export async function createSession(deploymentName: string) {
  try {
    const session = await SessionsService.createSessionDeploymentsDeploymentNameSessionsCreatePost({
      path: { deployment_name: deploymentName }
    });
    console.log('Created session:', session);
    return session;
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
}

// Example: Create and run a task
export async function createTask(deploymentName: string, input: string, sessionId?: string) {
  try {
    const task = await TasksService.createDeploymentTaskDeploymentsDeploymentNameTasksRunPost({
      path: { deployment_name: deploymentName },
      query: sessionId ? { session_id: sessionId } : undefined,
      body: { input }
    });
    console.log('Task result:', task);
    return task;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
}

// Example: Stream task events
export async function streamTaskEvents(
  deploymentName: string, 
  taskId: string, 
  sessionId: string,
  onData?: (data: any) => void
) {
  try {
    // Note: You might need to handle streaming differently based on your needs
    const events = await TasksService.getEventsDeploymentsDeploymentNameTasksTaskIdEventsGet({
      path: { 
        deployment_name: deploymentName, 
        task_id: taskId 
      },
      query: { session_id: sessionId }
    });
    
    if (onData) {
      onData(events);
    }
    
    return events;
  } catch (error) {
    console.error('Error streaming events:', error);
    throw error;
  }
}
*/

export {}; // Make this a module 