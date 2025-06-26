import { Request, Response } from 'express';
import Contact from '../models/Contact';
import { asyncHandler } from '../utils/errorHandler';

// Get all contacts (admin only)
export const getContacts = asyncHandler(async (req: Request, res: Response) => {
  // Handle query parameters
  const { read, sort = '-createdAt' } = req.query;
  
  // Build query
  const queryObj: any = {};
  
  // Filter by read status
  if (read === 'true') {
    queryObj.read = true;
  } else if (read === 'false') {
    queryObj.read = false;
  }
  
  // Execute query
  const contacts = await Contact.find(queryObj).sort(sort as string);
  
  res.status(200).json(contacts);
});

// Get single contact (admin only)
export const getContact = asyncHandler(async (req: Request, res: Response) => {
  const contact = await Contact.findById(req.params.id);
  
  if (!contact) {
    return res.status(404).json({ message: 'Contact not found' });
  }
  
  res.status(200).json(contact);
});

// Create contact (public)
export const createContact = asyncHandler(async (req: Request, res: Response) => {
  const contact = await Contact.create(req.body);
  res.status(201).json({
    message: 'Message sent successfully',
    contact
  });
});

// Mark contact as read (admin only)
export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
  let contact = await Contact.findById(req.params.id);
  
  if (!contact) {
    return res.status(404).json({ message: 'Contact not found' });
  }
  
  contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { read: true },
    { new: true }
  );
  
  res.status(200).json(contact);
});

// Delete contact (admin only)
export const deleteContact = asyncHandler(async (req: Request, res: Response) => {
  const contact = await Contact.findById(req.params.id);
  
  if (!contact) {
    return res.status(404).json({ message: 'Contact not found' });
  }
  
  await contact.deleteOne();
  
  res.status(200).json({ message: 'Contact deleted' });
}); 