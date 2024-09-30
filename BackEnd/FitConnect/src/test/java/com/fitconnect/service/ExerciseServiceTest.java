package com.fitconnect.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

import com.fitconnect.dto.ExerciseJournalDto;
import com.fitconnect.dto.ExerciseListDto;
import com.fitconnect.repository.ExerciseJournalDao;
import com.fitconnect.repository.ExerciseListDao;

@ExtendWith(MockitoExtension.class)
public class ExerciseServiceTest {

    @Mock
    private ExerciseListDao listDao;

    @Mock
    private ExerciseJournalDao journalDao;

    @InjectMocks
    private ExerciseServiceImpl exerciseService;

    private ExerciseJournalDto journalDto;
    private ExerciseListDto listDto;

    @BeforeEach
    public void setUp() {
        journalDto = new ExerciseJournalDto();
        journalDto.setE_journal_id(1);
        journalDto.setExercise_id(1);
        
        listDto = new ExerciseListDto();
        listDto.setExercise_id(1);
        listDto.setImage(mock(MultipartFile.class));  // Mock MultipartFile for image
    }

    @Test
    public void testSelectJournalAll() {
        when(journalDao.getExerJournalList(1)).thenReturn(Arrays.asList(journalDto));

        List<ExerciseJournalDto> result = exerciseService.selectJournalAll(1);
        
        assertEquals(1, result.size());
        assertEquals(journalDto, result.get(0));
        verify(journalDao, times(1)).getExerJournalList(1);
    }

    @Test
    public void testSelectExerJournalOne() {
        when(journalDao.getExer(1)).thenReturn(journalDto);

        ExerciseJournalDto result = exerciseService.selectExerJournalOne(1);

        assertEquals(journalDto, result);
        verify(journalDao, times(1)).getExer(1);
    }

    @Test
    public void testAddExercise() {
        when(journalDao.insert(any(ExerciseJournalDto.class))).thenReturn(true);

        boolean result = exerciseService.addExercise(Arrays.asList(journalDto));

        assertTrue(result);
        verify(journalDao, times(1)).insert(journalDto);
    }

    @Test
    public void testDeleteExer() {
        when(journalDao.delete(journalDto)).thenReturn(true);

        boolean result = exerciseService.deleteExer(journalDto);

        assertTrue(result);
        verify(journalDao, times(1)).delete(journalDto);
    }

    @Test
    public void testDeleteExerAll() {
        when(journalDao.deleteAll(1)).thenReturn(true);

        boolean result = exerciseService.deleteExerAll(1);

        assertTrue(result);
        verify(journalDao, times(1)).deleteAll(1);
    }

    @Test
    public void testUpdate() {
        when(journalDao.update(journalDto)).thenReturn(true);

        boolean result = exerciseService.update(journalDto);

        assertTrue(result);
        verify(journalDao, times(1)).update(journalDto);
    }

    @Test
    public void testSelectExetAll() {
        when(listDao.getExerList()).thenReturn(Arrays.asList(listDto));

        List<ExerciseListDto> result = exerciseService.selectExetAll();

        assertEquals(1, result.size());
        assertEquals(listDto, result.get(0));
        verify(listDao, times(1)).getExerList();
    }

    @Test
    public void testAddExerList() throws Exception {
        when(listDao.insertExetList(listDto)).thenReturn(true);

        boolean result = exerciseService.addExerList(listDto);

        assertTrue(result);
        verify(listDao, times(1)).insertExetList(listDto);
    }
}
